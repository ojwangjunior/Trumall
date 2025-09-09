package handlers

import (
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// Create a new store
func CreateStoreHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get logged-in user ID from middleware (set during authentication)
		//ensures only authenticated users can create stores
		userID := c.Locals("userID")
		if userID == nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
		}

		// Convert userID (string) -> UUID format
		uid, err := uuid.Parse(userID.(string))
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid user id"})
		}

		// Parse the request body (store name + description)
		var body struct {
			Name        string `json:"name"`
			Description string `json:"description"`
		}
		if err := c.BodyParser(&body); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
		}

		// Validation: make sure store name is not empty
		if body.Name == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "store name is required"})
		}

		// Create a new store record
		store := models.Store{
			OwnerID:     uid,
			Name:        body.Name,
			Description: &body.Description,
		}

		// Save store to database
		if err := db.Create(&store).Error; err != nil {
			log.Printf("create store error: %v", err) // log error internally
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to create store"})
		}

		// Return the newly created store
		return c.Status(http.StatusCreated).JSON(fiber.Map{"data": store})
	}
}

// Get a list of all stores
func ListStoresHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var stores []models.Store

		// Fetch all stores from DB
		if err := db.Find(&stores).Error; err != nil {
			log.Printf("list stores error: %v", err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch stores"})
		}

		