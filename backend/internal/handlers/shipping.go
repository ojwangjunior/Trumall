package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
	"trumall/internal/services"
)

// CalculateShippingHandler calculates shipping cost for preview before checkout
func CalculateShippingHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(models.User)

		type request struct {
			AddressID      uuid.UUID `json:"address_id"`
			ShippingMethod string    `json:"shipping_method"`
		}

		var req request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
		}

		// Verify address belongs to user
		var address models.Address
		if err := db.Where("id = ? AND user_id = ?", req.AddressID, user.ID).First(&address).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "address not found"})
		}

		// Calculate cart total and get store ID from cart
		var cart []models.CartItem
		if err := db.Preload("Product.Store").Where("user_id = ?", user.ID).Find(&cart).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to fetch cart"})
		}

		if len(cart) == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "cart is empty"})
		}

		var cartTotalCents int64
		var storeID uuid.UUID
		for _, item := range cart {
			cartTotalCents += int64(item.Quantity) * int64(item.Product.PriceCents)
			// Use the first product's store as the shipping origin
			// Note: This assumes single-store checkout. For multi-store, handle separately.
			if storeID == uuid.Nil {
				storeID = item.Product.StoreID
			}
		}

		// Calculate shipping with seller origin
		shippingService := services.NewShippingService(db)
		calculation, err := shippingService.CalculateShippingWithOrigin(storeID, req.AddressID, req.ShippingMethod, cartTotalCents)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(calculation)
	}
}

// GetAvailableShippingMethodsHandler returns all available shipping methods for user's cart
func GetAvailableShippingMethodsHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(models.User)

		addressIDParam := c.Query("address_id")
		if addressIDParam == "" {
			return c.Status(400).JSON(fiber.Map{"error": "address_id query parameter required"})
		}

		addressID, err := uuid.Parse(addressIDParam)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid address_id"})
		}

		// Verify address belongs to user
		var address models.Address
		if err := db.Where("id = ? AND user_id = ?", addressID, user.ID).First(&address).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "address not found"})
		}

		// Calculate cart total and get store ID from cart
		var cart []models.CartItem
		if err := db.Preload("Product.Store").Where("user_id = ?", user.ID).Find(&cart).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to fetch cart"})
		}

		if len(cart) == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "cart is empty"})
		}

		var cartTotalCents int64
		var storeID uuid.UUID
		for _, item := range cart {
			cartTotalCents += int64(item.Quantity) * int64(item.Product.PriceCents)
			// Use the first product's store as the shipping origin
			if storeID == uuid.Nil {
				storeID = item.Product.StoreID
			}
		}

		// Get all active shipping methods
		var methods []models.ShippingMethod
		if err := db.Where("is_active = ?", true).Find(&methods).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to fetch shipping methods"})
		}

		// Calculate shipping for each method with seller origin
		shippingService := services.NewShippingService(db)
		var results []services.ShippingCalculation
		for _, method := range methods {
			calc, err := shippingService.CalculateShippingWithOrigin(storeID, addressID, method.Code, cartTotalCents)
			if err != nil {
				// Skip methods that aren't available for this address/cart
				continue
			}
			results = append(results, *calc)
		}

		if len(results) == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "no shipping methods available for this address"})
		}

		return c.JSON(fiber.Map{
			"cart_total_cents": cartTotalCents,
			"shipping_methods": results,
		})
	}
}

// ListShippingMethodsHandler returns all active shipping methods
func ListShippingMethodsHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		shippingService := services.NewShippingService(db)
		methods, err := shippingService.ListAllShippingMethods()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to fetch shipping methods"})
		}

		return c.JSON(methods)
	}
}
