package services

import (
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/cache"
	"trumall/internal/models"
)

type ShippingService struct {
	db *gorm.DB
}

func NewShippingService(db *gorm.DB) *ShippingService {
	return &ShippingService{db: db}
}

type ShippingCalculation struct {
	MethodCode        string    `json:"method_code"`
	MethodName        string    `json:"method_name"`
	ShippingCostCents int64     `json:"shipping_cost_cents"`
	EstimatedDelivery time.Time `json:"estimated_delivery"`
	DeliveryDaysMin   int       `json:"delivery_days_min"`
	DeliveryDaysMax   int       `json:"delivery_days_max"`
	IsFreeShipping    bool      `json:"is_free_shipping"`
}

// CalculateShipping calculates shipping cost for a given address and method
func (s *ShippingService) CalculateShipping(addressID uuid.UUID, methodCode string, cartTotalCents int64) (*ShippingCalculation, error) {
	// Check cache first
	cacheKey := fmt.Sprintf("shipping:%s:%s:%d", addressID, methodCode, cartTotalCents/1000) // Cache by thousand to reduce key variations
	if cachedValue, found := cache.ShippingCache.Get(cacheKey); found {
		if calc, ok := cachedValue.(*ShippingCalculation); ok {
			return calc, nil
		}
	}

	// Fetch address
	var address models.Address
	if err := s.db.First(&address, "id = ?", addressID).Error; err != nil {
		return nil, fmt.Errorf("address not found: %w", err)
	}

	// Fetch shipping method
	var method models.ShippingMethod
	if err := s.db.Where("code = ? AND is_active = ?", methodCode, true).First(&method).Error; err != nil {
		return nil, fmt.Errorf("shipping method not found or inactive: %w", err)
	}

	// Find matching shipping zone (prioritized by specificity)
	zone, err := s.findMatchingZone(address)
	if err != nil {
		return nil, fmt.Errorf("no shipping zone found for address: %w", err)
	}

	// Calculate base cost
	totalCostCents := method.BaseCostCents + zone.AdditionalCostCents

	// Check for shipping rules (overrides, free shipping thresholds, etc.)
	var rule models.ShippingRule
	err = s.db.Where("shipping_method_id = ? AND shipping_zone_id = ? AND is_available = ?",
		method.ID, zone.ID, true).
		Preload("ShippingMethod").
		Preload("ShippingZone").
		First(&rule).Error

	isFreeShipping := false
	if err == nil {
		// Rule exists - apply it
		if rule.CostOverrideCents != nil {
			totalCostCents = *rule.CostOverrideCents
		}

		// Check for free shipping threshold
		if rule.FreeShippingThresholdCents != nil && cartTotalCents >= *rule.FreeShippingThresholdCents {
			totalCostCents = 0
			isFreeShipping = true
		}

		// Validate order value constraints
		if cartTotalCents < rule.MinOrderValueCents {
			return nil, fmt.Errorf("order value below minimum for this shipping method")
		}
		if rule.MaxOrderValueCents != nil && cartTotalCents > *rule.MaxOrderValueCents {
			return nil, fmt.Errorf("order value exceeds maximum for this shipping method")
		}
	}

	// Calculate estimated delivery
	estimatedDelivery := time.Now().Add(time.Duration(method.DeliveryDaysMax) * 24 * time.Hour)

	result := &ShippingCalculation{
		MethodCode:        method.Code,
		MethodName:        method.Name,
		ShippingCostCents: totalCostCents,
		EstimatedDelivery: estimatedDelivery,
		DeliveryDaysMin:   method.DeliveryDaysMin,
		DeliveryDaysMax:   method.DeliveryDaysMax,
		IsFreeShipping:    isFreeShipping,
	}

	// Cache the result for 1 hour
	cache.ShippingCache.Set(cacheKey, result, 1*time.Hour)

	return result, nil
}

// GetAvailableShippingMethods returns all available shipping methods for an address
func (s *ShippingService) GetAvailableShippingMethods(addressID uuid.UUID, cartTotalCents int64) ([]ShippingCalculation, error) {
	var address models.Address
	if err := s.db.First(&address, "id = ?", addressID).Error; err != nil {
		return nil, fmt.Errorf("address not found: %w", err)
	}

	// Get all active shipping methods
	var methods []models.ShippingMethod
	if err := s.db.Where("is_active = ?", true).Find(&methods).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch shipping methods: %w", err)
	}

	var results []ShippingCalculation
	for _, method := range methods {
		calc, err := s.CalculateShipping(addressID, method.Code, cartTotalCents)
		if err != nil {
			// Skip methods that aren't available for this address/cart
			continue
		}
		results = append(results, *calc)
	}

	if len(results) == 0 {
		return nil, errors.New("no shipping methods available for this address")
	}

	return results, nil
}

// findMatchingZone finds the most specific matching zone for an address
func (s *ShippingService) findMatchingZone(address models.Address) (*models.ShippingZone, error) {
	var zones []models.ShippingZone

	// Try to find zone by city first (most specific)
	if err := s.db.Where("country = ? AND city = ? AND is_active = ?",
		address.Country, address.City, true).
		Order("priority ASC").
		Find(&zones).Error; err != nil {
		return nil, err
	}

	if len(zones) > 0 {
		return &zones[0], nil
	}

	// Try state/region level
	if address.State != "" {
		if err := s.db.Where("country = ? AND state = ? AND city IS NULL AND is_active = ?",
			address.Country, address.State, true).
			Order("priority ASC").
			Find(&zones).Error; err != nil {
			return nil, err
		}

		if len(zones) > 0 {
			return &zones[0], nil
		}
	}

	// Fall back to country-level zone (least specific)
	if err := s.db.Where("country = ? AND state IS NULL AND city IS NULL AND is_active = ?",
		address.Country, true).
		Order("priority ASC").
		Find(&zones).Error; err != nil {
		return nil, err
	}

	if len(zones) > 0 {
		return &zones[0], nil
	}

	return nil, errors.New("no matching shipping zone found")
}

// GetShippingMethod retrieves a shipping method by code
func (s *ShippingService) GetShippingMethod(code string) (*models.ShippingMethod, error) {
	var method models.ShippingMethod
	if err := s.db.Where("code = ? AND is_active = ?", code, true).First(&method).Error; err != nil {
		return nil, fmt.Errorf("shipping method not found: %w", err)
	}
	return &method, nil
}

// ListAllShippingMethods returns all active shipping methods
func (s *ShippingService) ListAllShippingMethods() ([]models.ShippingMethod, error) {
	var methods []models.ShippingMethod
	if err := s.db.Where("is_active = ?", true).Order("name ASC").Find(&methods).Error; err != nil {
		return nil, err
	}
	return methods, nil
}
