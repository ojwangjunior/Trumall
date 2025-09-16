package handlers

import (
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// Create a new store
func CreateStoreHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get logged-in user from middleware
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
		}
        uid := user.ID

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

// Get stores for the logged-in user
func GetUserStoresHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
		}
		userIDStr := user.ID.String()
		
		var stores []models.Store
		// Query the database for stores where owner_id matches the logged-in user
		if err := db.Where("owner_id = ?", userIDStr).Find(&stores).Error; err != nil {
			log.Printf("get user stores error: %v", err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch user stores"})
		}

		return c.JSON(fiber.Map{"data": stores})
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

		// Return the list of stores
		return c.JSON(fiber.Map{"data": stores})
	}
}

// Get a single store + its products
func GetStoreHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get store ID from URL param
		id := c.Params("id")

		// automatically fetch and loads all products linked to the store
		var store models.Store
		if err := db.Preload("Products").First(&store, "id = ?", id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "store not found"})
			}
			log.Printf("get store error: %v", err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch store"})
		}

		// Return store with its products
		return c.JSON(fiber.Map{"data": store})
	}
}
