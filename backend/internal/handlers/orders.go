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

// GetSellerOrdersHandler retrieves all orders for the stores owned by the authenticated seller.
func GetSellerOrdersHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
		}

		var stores []models.Store
		if err := db.Where("owner_id = ?", user.ID).Find(&stores).Error; err != nil {
			log.Printf("Error fetching stores for user %s: %v", user.ID, err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch stores"})
		}

		var storeIDs []string
		for _, store := range stores {
			storeIDs = append(storeIDs, store.ID.String())
		}

		var orders []models.Order
		if err := db.Preload("OrderItems.Product.Images").Preload("Buyer").Where("store_id IN ?", storeIDs).Find(&orders).Error; err != nil {
			log.Printf("Error fetching orders for seller %s: %v", user.ID, err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch orders"})
		}

		return c.JSON(orders)
	}
}

// UpdateOrderStatusHandler updates the status of an order.
func UpdateOrderStatusHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		orderID := c.Params("id")

		var body struct {
			Status string `json:"status"`
		}

		if err := c.BodyParser(&body); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
		}

		var order models.Order
		if err := db.First(&order, "id = ?", orderID).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "order not found"})
		}

		order.Status = body.Status
		if err := db.Save(&order).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to update order status"})
		}

		return c.JSON(order)
	}
}
