package mpesa

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"trumall/internal/models"
)

func StkCallbackHandler(dbConn *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		log.Println("Received M-Pesa Callback:", string(c.Body())) // <== log raw callback

		var cb models.StkCallbackWrapper
		if err := json.Unmarshal(c.Body(), &cb); err != nil {
			log.Println("callback decode err:", err)
			return c.Status(fiber.StatusBadRequest).SendString("invalid payload")
		}

		sc := cb.Body.StkCallback
		if sc.ResultCode == 0 {
			var amount int
			var receipt, phone string
			for _, it := range sc.CallbackMetadata.Item {
				n := strings.ToLower(it.Name)
				switch n {
				case "amount":
					if v, ok := it.Value.(float64); ok {
						amount = int(v)
					}
				case "mpesareceiptnumber":
					if v, ok := it.Value.(string); ok {
						receipt = v
					}
				case "phonenumber", "phone":
					switch v := it.Value.(type) {
					case float64:
						phone = fmt.Sprintf("254%d", int64(v))
					case string:
						phone = v
					}
				}
			}

			// Start a transaction for atomicity
			tx := dbConn.Begin()
			if tx.Error != nil {
				log.Println("failed to begin transaction:", tx.Error)
				return c.Status(fiber.StatusInternalServerError).SendString("internal server error")
			}
			defer func() {
				if r := recover(); r != nil {
					tx.Rollback()
				}
			}()

			var payment models.Payment
			if err := tx.Where("checkout_request_id = ?", sc.CheckoutRequestID).First(&payment).Error; err != nil {
				log.Println("payment not found for checkout_request_id:", sc.CheckoutRequestID, err)
				tx.Rollback()
				return c.Status(fiber.StatusNotFound).SendString("payment not found")
			}

			// Update Payment status
			if err := tx.Model(&payment).
				Updates(map[string]interface{}{
					"status":        "paid",
					"mpesa_receipt": receipt,
					"phone":         phone,
					"amount_cents":  amount * 100,
					"updated_at":    time.Now(),
				}).Error; err != nil {
				log.Println("db update payment err:", err)
				tx.Rollback()
				return c.Status(fiber.StatusInternalServerError).SendString("internal server error")
			}

			var order models.Order
			if err := tx.Where("id = ?", payment.OrderID).First(&order).Error; err != nil {
				log.Println("order not found for payment_id:", payment.ID, err)
				tx.Rollback()
				return c.Status(fiber.StatusNotFound).SendString("order not found")
			}

			var orderItems []models.OrderItem
			if err := tx.Where("order_id = ?", order.ID).Find(&orderItems).Error; err != nil {
				log.Println("failed to fetch order items for order:", order.ID, err)
				tx.Rollback()
				return c.Status(fiber.StatusInternalServerError).SendString("internal server error")
			}

			// Deduct stock
			for _, orderItem := range orderItems {
				if err := tx.Model(&models.Product{}).
					Where("id = ?", orderItem.ProductID).
					Update("stock", gorm.Expr("stock - ?", orderItem.Quantity)).Error; err != nil {
					log.Println("failed to deduct stock for product:", orderItem.ProductID, err)
					tx.Rollback()
					return c.Status(fiber.StatusInternalServerError).SendString("internal server error")
				}
			}

			// Clear cart
			if err := tx.Where("user_id = ?", order.BuyerID).Delete(&models.CartItem{}).Error; err != nil {
				log.Println("failed to clear cart for user:", order.BuyerID, err)
				tx.Rollback()
				return c.Status(fiber.StatusInternalServerError).SendString("internal server error")
			}

			// Update Order status
			if err := tx.Model(&order).Updates(models.Order{Status: "paid", UpdatedAt: time.Now()}).Error; err != nil {
				log.Println("db update order status err:", err)
				tx.Rollback()
				return c.Status(fiber.StatusInternalServerError).SendString("internal server error")
			}

			if err := tx.Commit().Error; err != nil {
				log.Println("failed to commit transaction:", err)
				return c.Status(fiber.StatusInternalServerError).SendString("internal server error")
			}

			// Trigger Soroban credit (async)
			go func() {
				if err := InvokeSorobanCredit("", amount, receipt); err != nil {
					log.Println("soroban invoke err:", err)
				}
			}()
		} else {
			log.Println("STK failed:", sc.ResultCode, sc.ResultDesc)
			// Start a transaction for failed payment
			tx := dbConn.Begin()
			if tx.Error != nil {
				log.Println("failed to begin transaction for failed STK:", tx.Error)
				return c.Status(fiber.StatusInternalServerError).SendString("internal server error")
			}
			defer func() {
				if r := recover(); r != nil {
					tx.Rollback()
				}
			}()

			var payment models.Payment
			if err := tx.Where("checkout_request_id = ?", sc.CheckoutRequestID).First(&payment).Error; err != nil {
				log.Println("payment not found for failed STK checkout_request_id:", sc.CheckoutRequestID, err)
				tx.Rollback()
				return c.Status(fiber.StatusNotFound).SendString("payment not found for failed STK")
			}

			_ = tx.Model(&payment).
				Updates(map[string]interface{}{
					"status":     "failed",
					"updated_at": time.Now(),
				}).Error

			var order models.Order
			if err := tx.Where("id = ?", payment.OrderID).First(&order).Error; err != nil {
				log.Println("order not found for failed payment_id:", payment.ID, err)
				tx.Rollback()
				return c.Status(fiber.StatusNotFound).SendString("order not found for failed payment")
			}

			_ = tx.Model(&order).Updates(models.Order{Status: "failed", UpdatedAt: time.Now()}).Error

			if err := tx.Commit().Error; err != nil {
				log.Println("failed to commit transaction for failed STK:", err)
				return c.Status(fiber.StatusInternalServerError).SendString("internal server error")
			}
		}

		return c.JSON(fiber.Map{"ResultCode": 0, "ResultDesc": "Accepted"})
	}
}
