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

		// Create or update cart item
		var cartItem models.CartItem
		if err := db.Where("user_id = ? AND product_id = ?", user.ID, body.ProductID).First(&cartItem).Error; err == nil {
			cartItem.Quantity += body.Quantity
			db.Save(&cartItem)
		} else {
			cartItem = models.CartItem{
				UserID:    user.ID,
				ProductID: product.ID,
				Quantity:  body.Quantity,
			}
			db.Create(&cartItem)
		}

		return c.JSON(cartItem)
	}
}

// Get user cart
func GetCartHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(models.User)
		var items []models.CartItem
		db.Preload("Product").Where("user_id = ?", user.ID).Find(&items)
		return c.JSON(items)
	}
}

// Remove from cart
func RemoveFromCartHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(models.User)
		id := c.Params("id")
		db.Where("id = ? AND user_id = ?", id, user.ID).Delete(&models.CartItem{})
		return c.JSON(fiber.Map{"message": "removed"})
	}
}

// Checkout: create order & deduct stock
func CheckoutHandler(db *gorm.DB) fiber.Handler {
	