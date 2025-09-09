package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
)

func PaymentWebhookHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		secret := os.Getenv("WEBHOOK_SECRET")
		if secret == "" {
			return c.Status(500).JSON(fiber.Map{"error": "server misconfigured (no webhook secret)"})
		}
		signature := c.Get("X-Signature")
		if signature == "" {
			return c.Status(401).JSON(fiber.Map{"error": "missing signature"})
		}
		// compute HMAC sha256 of body
		body := c.Body()
		mac := hmac.New(sha256.New, []byte(secret))
		mac.Write(body)
		expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))
		if !hmac.Equal([]byte(expected), []byte(signature)) {
			return c.Status(401).JSON(fiber.Map{"error": "invalid signature"})
		}

		var payload struct {
			PaymentID    string `json:"payment_id"`
			ProviderTxID string `json:"provider_tx_id"`
			Status       string `json:"status"`
		}
		if err := c.BodyParser(&payload); err != nil {
			return fiber.ErrBadRequest
		}
		pid, err := uuid.Parse(payload.PaymentID)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid payment id"})
		}
		var p models.Payment
		if err := db.First(&p, "id = ?", pid).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "payment not found"})
		}
		p.ProviderTxID = &payload.ProviderTxID
		p.Status = payload.Status
		if err := db.Save(&p).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to update payment"})
		}
		if payload.Status == "succeeded" {
			var o models.Order
			if err := db.First(&o, "id = ?", p.OrderID).Error; err == nil {
				o.Status = "paid"
				db.Save(&o)
			}
		}
		return c.SendStatus(200)
	}
}
