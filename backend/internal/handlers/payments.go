package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// GetPaymentStatusHandler retrieves the status of a payment by order ID or checkout request ID.
func GetPaymentStatusHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		orderIDStr := c.Query("orderId")
		checkoutRequestID := c.Query("checkoutRequestId")

		if orderIDStr == "" && checkoutRequestID == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "orderId or checkoutRequestId is required"})
		}

		var payment models.Payment
		query := db.Model(&models.Payment{})

		if orderIDStr != "" {
			orderID, err := uuid.Parse(orderIDStr)
			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid orderId"})
			}
			query = query.Where("order_id = ?", orderID)
		}

		if checkoutRequestID != "" {
			query = query.Where("checkout_request_id = ?", checkoutRequestID)
		}

		if err := query.First(&payment).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "payment not found"})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to retrieve payment status"})
		}

		return c.JSON(fiber.Map{"status": payment.Status})
	}
}
