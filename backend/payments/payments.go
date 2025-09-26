package payments

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"trumall/internal/models"
	"trumall/mpesa"
)

func CreateMpesaPaymentHandler(dbConn *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body struct {
			OrderID string `json:"order_id"`
			Phone   string `json:"phone"`
		}
		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).SendString("invalid request")
		}

		// lookup order, get amount
		var order models.Order
		if err := dbConn.First(&order, "id = ?", body.OrderID).Error; err != nil {
			return c.Status(404).SendString("order not found")
		}

		checkoutID, err := mpesa.InitiateSTK(body.Phone, int(order.TotalCents/100), order.ID.String(), order.ID.String())
		if err != nil {
			return c.Status(500).SendString(fmt.Sprintf("stk push failed: %v", err))
		}

		// Save payment record
		payment := models.Payment{
			OrderID:           order.ID,
			Provider:          "mpesa",
			AmountCents:       order.TotalCents,
			Currency:          "KES",
			Status:            "pending",
			CheckoutRequestID: &checkoutID,
			Phone:             &body.Phone,
		}
		