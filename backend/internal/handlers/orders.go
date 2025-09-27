package handlers

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// GetOrdersHandler retrieves all orders for the authenticated user.
func GetOrdersHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
		}

		var orders []models.Order
		if err := db.Preload("OrderItems.Product.Images").Where("buyer_id = ?", user.ID).Find(&orders).Error; err != nil {
			log.Printf("Error fetching orders for user %s: %v", user.ID, err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch orders"})
		}

		return c.JSON(orders)
	}
}
