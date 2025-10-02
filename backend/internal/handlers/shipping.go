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

		// Calculate cart total
		var cart []models.CartItem
		if err := db.Preload("Product").Where("user_id = ?", user.ID).Find(&cart).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to fetch cart"})
		}

		var cartTotalCents int64
		for _, item := range cart {
			cartTotalCents += int64(item.Quantity) * int64(item.Product.PriceCents)
		}

		// Calculate shipping
		shippingService := services.NewShippingService(db)
		calculation, err := shippingService.CalculateShipping(req.AddressID, req.ShippingMethod, cartTotalCents)
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

		// Calculate cart total
		var cart []models.CartItem
		if err := db.Preload("Product").Where("user_id = ?", user.ID).Find(&cart).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to fetch cart"})
		}

		var cartTotalCents int64
		for _, item := range cart {
			cartTotalCents += int64(item.Quantity) * int64(item.Product.PriceCents)
		}

		// Get available methods
		shippingService := services.NewShippingService(db)
		methods, err := shippingService.GetAvailableShippingMethods(addressID, cartTotalCents)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(fiber.Map{
			"cart_total_cents":  cartTotalCents,
			"shipping_methods":  methods,
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
