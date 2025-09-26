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
		