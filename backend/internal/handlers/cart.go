package handlers

import (
	"fmt"
	"log"

	// Add this import
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
	"trumall/internal/services"
	"trumall/mpesa" // Add this import
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
		fmt.Println("userID:", userID.String(), "productID:", body.ProductID.String())

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

		type CheckoutRequest struct {
			Phone           string    `json:"phone"`
			AddressID       uuid.UUID `json:"address_id"`
			ShippingMethod  string    `json:"shipping_method"`
		}
		var checkoutReq CheckoutRequest
		if err := c.BodyParser(&checkoutReq); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
		}

		// Fetch the selected address
		var shippingAddress models.Address
		if err := db.Where("id = ? AND user_id = ?", checkoutReq.AddressID, user.ID).First(&shippingAddress).Error; err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid shipping address"})
		}

		var cart []models.CartItem
		if err := db.Preload("Product").Where("user_id = ?", user.ID).Find(&cart).Error; err != nil {
			log.Printf("Error fetching cart for user %s: %v", user.ID, err)
			return c.Status(500).JSON(fiber.Map{"error": "failed to fetch cart"})
		}
		if len(cart) == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "cart is empty"})
		}

		// ✅ Get StoreID from the first product in the cart
		storeID := cart[0].Product.StoreID
		if storeID == uuid.Nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid store for product"})
		}

		// ✅ Calculate cart total (before shipping)
		var cartTotalCents int64
		for _, item := range cart {
			cartTotalCents += int64(item.Quantity) * int64(item.Product.PriceCents)
		}

		// ✅ Calculate shipping using shipping service
		shippingService := services.NewShippingService(db)
		shippingCalc, err := shippingService.CalculateShipping(checkoutReq.AddressID, checkoutReq.ShippingMethod, cartTotalCents)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": fmt.Sprintf("shipping calculation failed: %v", err)})
		}

		// ✅ Calculate total including shipping
		totalCents := cartTotalCents + shippingCalc.ShippingCostCents

		// Start a transaction
		tx := db.Begin()
		if tx.Error != nil {
			log.Printf("Error beginning transaction: %v", tx.Error)
			return c.Status(500).JSON(fiber.Map{"error": "failed to begin transaction"})
		}
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		// ✅ Create order with storeID and shipping details
		order := models.Order{
			BuyerID:           user.ID,
			StoreID:           storeID,
			ShippingAddressID: shippingAddress.ID,
			TotalCents:        totalCents,
			ShippingCostCents: shippingCalc.ShippingCostCents,
			Currency:          "KES",
			Status:            "pending", // Status is pending until payment is confirmed
			ShippingMethod:    checkoutReq.ShippingMethod,
			EstimatedDelivery: shippingCalc.EstimatedDelivery,
		}
		if err := tx.Create(&order).Error; err != nil {
			tx.Rollback()
			log.Printf("Error creating order for user %s: %v", user.ID, err)
			return c.Status(500).JSON(fiber.Map{"error": "failed to create order"})
		}

		// ✅ Create order items (stock deduction and cart clearing moved to M-Pesa callback)
		for _, item := range cart {
			if item.Quantity > item.Product.Stock {
				tx.Rollback()
				return c.Status(400).JSON(fiber.Map{"error": "not enough stock for " + item.Product.Title})
			}

			orderItem := models.OrderItem{
				OrderID:        order.ID,
				ProductID:      item.ProductID,
				Quantity:       item.Quantity,
				UnitPriceCents: item.Product.PriceCents,
			}
			if err := tx.Create(&orderItem).Error; err != nil {
				tx.Rollback()
				log.Printf("Error creating order item for order %s: %v", order.ID, err)
				return c.Status(500).JSON(fiber.Map{"error": "failed to create order item"})
			}
		}

		// ✅ Create Payment record
		payment := models.Payment{
			ID:          uuid.New(),
			OrderID:     order.ID,
			Provider:    "M-Pesa",
			AmountCents: totalCents,
			Currency:    "KES",
			Status:      "initiated",
			Phone:       &checkoutReq.Phone,
		}
		if err := tx.Create(&payment).Error; err != nil {
			tx.Rollback()
			log.Printf("Error creating payment for order %s: %v", order.ID, err)
			return c.Status(500).JSON(fiber.Map{"error": "failed to create payment"})
		}

		// Check for minimum M-Pesa amount (1 KES = 100 cents)
		if totalCents < 100 {
			tx.Rollback()
			return c.Status(400).JSON(fiber.Map{"error": "M-Pesa minimum amount is 1 KES"})
		}

		// ✅ Initiate M-Pesa STK Push
		checkoutRequestID, err := mpesa.InitiateSTK(checkoutReq.Phone, int(totalCents/100), order.ID.String(), order.ID.String())
		if err != nil {
			tx.Rollback()
			log.Printf("Error initiating M-Pesa STK push for order %s: %v", order.ID, err)
			return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("failed to initiate M-Pesa STK push: %v", err)})
		}
		payment.CheckoutRequestID = &checkoutRequestID
		if err := tx.Save(&payment).Error; err != nil {
			tx.Rollback()
			log.Printf("Error saving payment with checkout request ID for order %s: %v", order.ID, err)
			return c.Status(500).JSON(fiber.Map{"error": "failed to update payment with checkout request ID"})
		}

		if err := tx.Commit().Error; err != nil {
			log.Printf("Error committing transaction for order %s: %v", order.ID, err)
			return c.Status(500).JSON(fiber.Map{"error": "failed to commit transaction"})
		}

		return c.JSON(fiber.Map{
			"order_id":            order.ID,
			"checkout_request_id": checkoutRequestID,
			"shipping_cost_cents": order.ShippingCostCents,
			"estimated_delivery":  order.EstimatedDelivery,
		})
	}
}
