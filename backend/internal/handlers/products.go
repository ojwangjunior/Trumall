package handlers

import (
	"net/http"

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
		if err := c.BodyParser(&body); err != nil {
			return fiber.ErrBadRequest
		}
		// basic validation
		if body.Title == "" || body.PriceCents <= 0 {
			return c.Status(400).JSON(fiber.Map{"error": "title and positive price_cents required"})
		}
		if len(body.Title) > 255 {
			return c.Status(400).JSON(fiber.Map{"error": "title too long (max 255 characters)"})
		}
		if body.PriceCents <= 0 {
			return c.Status(400).JSON(fiber.Map{"error": "price_cents must be greater than 0"})
		}
		if body.Stock < 0 {
			return c.Status(400).JSON(fiber.Map{"error": "stock cannot be negative"})
		}
		sid, err := uuid.Parse(body.StoreID)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid store id"})
		}

		// get user id from context (set by RequireAuth middleware)
		uidv := c.Locals("user_id")
		if uidv == nil {
			return c.Status(401).JSON(fiber.Map{"error": "unauthenticated"})
		}
		uid, ok := uidv.(uuid.UUID)
		if !ok {
			return c.Status(500).JSON(fiber.Map{"error": "invalid user id in context"})
		}

		// load store and check ownership
		var store models.Store
		if err := db.First(&store, "id = ?", sid).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "store not found"})
		}
		if store.OwnerID != uid {
			return c.Status(403).JSON(fiber.Map{"error": "only store owner can add products"})
		}

		p := models.Product{
			ID:          uuid.New(),
			StoreID:     sid,
			Title:       body.Title,
			Description: nil,
			PriceCents:  body.PriceCents,
			Currency:    body.Currency,
			Stock:       body.Stock,
		}
		if body.Description != nil {
			p.Description = body.Description
		}
		if p.Currency == "" {
			p.Currency = "USD"
		}
		if err := db.Create(&p).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create product"})
		}
		db.Preload("Store").First(&p, "id = ?", p.ID)
		return c.Status(201).JSON(p)
	}
}

// ListProductsHandler - list all products with store info
func ListProductsHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var products []models.Product

		// 👇 Preload Store so each product comes with its store
		if err := db.Preload("Store").Find(&products).Error; err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch products"})
		}

		return c.JSON(products)
	}
}
