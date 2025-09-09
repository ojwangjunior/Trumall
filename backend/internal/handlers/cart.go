package handlers

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// Add product to cart
func AddToCartHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		type request struct {
			ProductID string `json:"product_id"`
			Quantity  int    `json:"quantity"`
		}
		var body request
		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
		}

		// Get user from middleware (set by RequireAuth)
		user := c.Locals("user").(models.User)

		// Check product exists
		var product models.Product
		if err := db.First(&product, "id = ?", body.ProductID).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}

		// Check stock
		if body.Quantity > product.Stock {
			return c.Status(400).JSON(fiber.Map{"error": "not enough stock"})
		}

		