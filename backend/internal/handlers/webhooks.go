package handlers

import (
	"encoding/json"
	"log"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// MpesaCallbackBody represents the structure of the M-Pesa STK push callback
type MpesaCallbackBody struct {
	Body struct {
		StkCallback struct {
			MerchantRequestID string `json:"MerchantRequestID"`
			CheckoutRequestID string `json:"CheckoutRequestID"`
			ResultCode        int    `json:"ResultCode"`
			ResultDesc        string `json:"ResultDesc"`
			CallbackMetadata  struct {
				Item []struct {
					Name  string      `json:"Name"`
					Value interface{} `json:"Value,omitempty"`
				} `json:"Item"`
			} `json:"CallbackMetadata"`
		} `json:"stkCallback"`
	} `json:"Body"`
}

// MpesaCallbackHandler processes the callback from M-Pesa
func MpesaCallbackHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var callbackBody MpesaCallbackBody
		if err := json.Unmarshal(c.Body(), &callbackBody); err != nil {
			log.Printf("Error unmarshalling M-Pesa callback: %v", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid callback format"})
		}

		stkCallback := callbackBody.Body.StkCallback
		log.Printf("Received M-Pesa callback for CheckoutRequestID %s with ResultCode %d", stkCallback.CheckoutRequestID, stkCallback.ResultCode)

		// Find the payment record using the checkout request ID
		var payment models.Payment
		if err := db.Where("checkout_request_id = ?", stkCallback.CheckoutRequestID).First(&payment).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				log.Printf("Payment not found for CheckoutRequestID: %s", stkCallback.CheckoutRequestID)
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "payment not found"})
			}
			log.Printf("Error retrieving payment for CheckoutRequestID %s: %v", stkCallback.CheckoutRequestID, err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to retrieve payment"})
		}

		// Begin a transaction
		tx := db.Begin()
		if tx.Error != nil {
			log.Printf("Error starting transaction for M-Pesa callback: %v", tx.Error)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "transaction error"})
		}
		defer tx.Rollback() // Rollback on panic

		// Update payment status based on M-Pesa result code
		if stkCallback.ResultCode == 0 {
			payment.Status = "paid"
			// Extract M-Pesa receipt number from metadata
			for _, item := range stkCallback.CallbackMetadata.Item {
				if item.Name == "MpesaReceiptNumber" {
					if receipt, ok := item.Value.(string); ok {
						payment.ProviderTxID = &receipt
					}
				}
			}
		} else {
			payment.Status = "failed"
		}

		if err := tx.Save(&payment).Error; err != nil {
			log.Printf("Error updating payment status for order %s: %v", payment.OrderID, err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to update payment status"})
		}

		// If payment was successful, update the order status
		if payment.Status == "paid" {
			if err := tx.Model(&models.Order{}).Where("id = ?", payment.OrderID).Update("status", "paid").Error; err != nil {
				log.Printf("Error updating order status for order %s: %v", payment.OrderID, err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to update order status"})
			}
		}

		// Commit the transaction
		if err := tx.Commit().Error; err != nil {
			log.Printf("Error committing transaction for M-Pesa callback: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to commit transaction"})
		}

		log.Printf("Successfully processed M-Pesa callback for CheckoutRequestID %s", stkCallback.CheckoutRequestID)
		return c.SendStatus(fiber.StatusOK)
	}
}