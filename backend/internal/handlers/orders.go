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

			if prod.Stock < it.Quantity {
				tx.Rollback()
				return c.Status(400).JSON(fiber.Map{"error": "insufficient stock"})
			}
			item := models.OrderItem{ID: uuid.New(), OrderID: order.ID, ProductID: prod.ID, UnitPriceCents: prod.PriceCents, Quantity: it.Quantity}
			if err := tx.Create(&item).Error; err != nil {
				tx.Rollback()
				return c.Status(500).JSON(fiber.Map{"error": "failed to create order item"})
			}
			prod.Stock -= it.Quantity
			if err := tx.Save(&prod).Error; err != nil {
				tx.Rollback()
				return c.Status(500).JSON(fiber.Map{"error": "failed to update product stock"})
			}
			total += prod.PriceCents * int64(it.Quantity)
		}

		order.TotalCents = total
		if err := tx.Save(&order).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(fiber.Map{"error": "failed to update order total"})
		}

		payment := models.Payment{ID: uuid.New(), OrderID: order.ID, Provider: "onchain", AmountCents: order.TotalCents, Currency: "USD", Status: "initiated"}
		if err := tx.Create(&payment).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(fiber.Map{"error": "failed to create payment"})
		}

		if err := tx.Commit().Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to commit transaction"})
		}

		// load items for response
		var items []models.OrderItem
		if err := db.Where("order_id = ?", order.ID).Find(&items).Error; err != nil {
			// not fatal; return order and payment anyway
			return c.Status(201).JSON(fiber.Map{"order": order, "payment": payment})
		}

		return c.Status(201).JSON(fiber.Map{"order": order, "items": items, "payment": payment})
	}
}
