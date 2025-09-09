package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"trumall/internal/models"
)

func CreateOrderHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body struct {
			StoreID string `json:"store_id"`
			Items   []struct {
				ProductID string `json:"product_id"`
				Quantity  int    `json:"quantity"`
			} `json:"items"`
		}
		
}
