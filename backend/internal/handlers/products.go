package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// CreateProductHandler requires auth and checks that the authenticated user is the store owner.
func CreateProductHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body struct {
			StoreID     string  `json:"store_id"`
			Title       string  `json:"title"`
			Description *string `json:"description"`
			PriceCents  int64   `json:"price_cents"`
			Currency    string  `json:"currency"`
			Stock       int     `json:"stock"`
		}
		