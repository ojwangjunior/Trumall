package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// Add product to cart
func AddToCartHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		type request struct {
			ProductID uuid.UUID `json:"product_id"`
			Quantity  int       `json:"quantity"`
		}
		var body request
		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
		}

		// Get user ID from JWT
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
		}
		userID := user.ID // Extract userID from the user object

		// Check if product exists
		var product models.Product
		if err := db.First(&product, "id = ?", body.ProductID).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}

		// Check if cart item already exists
		var cartItem models.CartItem
		err := db.Where("user_id = ? AND product_id = ?", userID, body.ProductID).First(&cartItem).Error
		if err == nil {
			if cartItem.Quantity+body.Quantity > product.Stock {
				return c.Status(400).JSON(fiber.Map{
					"error": fmt.Sprintf("Out of stock. %d more items can be added.", product.Stock-cartItem.Quantity),
				})
			}
			cartItem.Quantity += body.Quantity
			db.Save(&cartItem)
		} else {
			// Create new cart item
			if body.Quantity > product.Stock {
				return c.Status(400).JSON(fiber.Map{
					"error": fmt.Sprintf("only %d items available", product.Stock),
				})
			}
			cartItem = models.CartItem{
				UserID:    userID,
				ProductID: product.ID,
				Quantity:  body.Quantity,
				Price:     product.PriceCents, // Set price from product
			}
			db.Create(&cartItem)
		}

		// Preload product for the response
		db.Preload("Product").First(&cartItem, "id = ?", cartItem.ID)
		return c.JSON(cartItem)
	}
}

// Get user cart
func GetCartHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(models.User)
		var items []models.CartItem
		db.Preload("Product.Images").Where("user_id = ?", user.ID).Find(&items)
		return c.JSON(items)
	}
}

func RemoveFromCartHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(models.User)
		id := c.Params("id")
		db.Where("id = ? AND user_id = ?", id, user.ID).Delete(&models.CartItem{})
		return c.JSON(fiber.Map{"message": "removed"})
	}
}

// Increase product quantity in cart
func IncreaseCartItemQuantityHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		type request struct {
			ProductID uuid.UUID `json:"product_id"`
		}
		var body request
		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
		}

		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
		}

		var cartItem models.CartItem
		if err := db.Where("user_id = ? AND product_id = ?", user.ID, body.ProductID).First(&cartItem).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "item not found in cart"})
		}

		var product models.Product
		if err := db.First(&product, "id = ?", body.ProductID).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}

		if cartItem.Quantity+1 > product.Stock {
			return c.Status(400).JSON(fiber.Map{"error": "not enough stock"})
		}

		cartItem.Quantity++
		db.Save(&cartItem)

		var items []models.CartItem
		db.Preload("Product.Images").Where("user_id = ?", user.ID).Find(&items)
		return c.JSON(items)
	}
}

// Decrease product quantity in cart
func DecreaseCartItemQuantityHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		type request struct {
			ProductID uuid.UUID `json:"product_id"`
		}
		var body request
		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
		}

		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
		}

		var cartItem models.CartItem
		if err := db.Where("user_id = ? AND product_id = ?", user.ID, body.ProductID).First(&cartItem).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "item not found in cart"})
		}

		cartItem.Quantity--
		if cartItem.Quantity <= 0 {
			db.Delete(&cartItem)
		} else {
			db.Save(&cartItem)
		}

		var items []models.CartItem
		db.Preload("Product.Images").Where("user_id = ?", user.ID).Find(&items)
		return c.JSON(items)
	}
}

// Checkout: create order & deduct stock
func CheckoutHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(models.User)

		var cart []models.CartItem
		db.Preload("Product").Where("user_id = ?", user.ID).Find(&cart)
		if len(cart) == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "cart is empty"})
		}

		// Create order
		order := models.Order{
			BuyerID: user.ID,
			Status:  "pending",
		}
		db.Create(&order)

		// Create order items + deduct stock
		for _, item := range cart {
			if item.Quantity > item.Product.Stock {
				return c.Status(400).JSON(fiber.Map{"error": "not enough stock for " + item.Product.Title})
			}

			orderItem := models.OrderItem{
				OrderID:        order.ID,
				ProductID:      item.ProductID,
				Quantity:       item.Quantity,
				UnitPriceCents: item.Product.PriceCents,
			}
			db.Create(&orderItem)

			// Deduct stock
			db.Model(&models.Product{}).
				Where("id = ?", item.ProductID).
				Update("stock", gorm.Expr("stock - ?", item.Quantity))
		}

		// Clear cart
		db.Where("user_id = ?", user.ID).Delete(&models.CartItem{})

		return c.JSON(order)
	}
}
