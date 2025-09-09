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
		if err := c.BodyParser(&body); err != nil {
			return fiber.ErrBadRequest
		}
		if len(body.Items) == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "items required"})
		}
		storeID, err := uuid.Parse(body.StoreID)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid store id"})
		}

		// get buyer id from context (RequireAuth)
		uidv := c.Locals("user_id")
		if uidv == nil {
			return c.Status(401).JSON(fiber.Map{"error": "unauthenticated"})
		}
		buyerID, ok := uidv.(uuid.UUID)
		if !ok {
			return c.Status(500).JSON(fiber.Map{"error": "invalid user id in context"})
		}

		order := models.Order{ID: uuid.New(), BuyerID: buyerID, StoreID: storeID, Status: "pending"}
		var total int64 = 0

		tx := db.Begin()
		if tx.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to begin tx"})
		}
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		if err := tx.Create(&order).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(fiber.Map{"error": "failed to create order"})
		}

		for _, it := range body.Items {
			pid, err := uuid.Parse(it.ProductID)
			if err != nil {
				tx.Rollback()
				return c.Status(400).JSON(fiber.Map{"error": "invalid product id"})
			}
			var prod models.Product
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
				First(&prod, "id = ?", pid).Error; err != nil {
				tx.Rollback()
				return c.Status(400).JSON(fiber.Map{"error": "product not found"})
			}

			