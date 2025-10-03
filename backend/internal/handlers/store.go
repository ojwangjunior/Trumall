package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
)

func GetMyStoresHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthenticated"})
		}

		var stores []models.Store
		if err := db.Where("owner_id = ?", user.ID).Find(&stores).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch stores"})
		}

		return c.JSON(stores)
	}
}

func GetStoreHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		storeID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid store ID"})
		}

		var store models.Store
		if err := db.First(&store, "id = ?", storeID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "store not found"})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch store"})
		}

		return c.JSON(store)
	}
}

func UpdateStoreHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		storeID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid store ID"})
		}

		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthenticated"})
		}

		var store models.Store
		if err := db.First(&store, "id = ? AND owner_id = ?", storeID, user.ID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "you do not own this store"})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "database error"})
		}

		var input models.Store
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
		}

		store.Name = input.Name
		store.Description = input.Description
		// Update warehouse location fields
		store.WarehouseStreet = input.WarehouseStreet
		store.WarehouseCity = input.WarehouseCity
		store.WarehouseState = input.WarehouseState
		store.WarehouseCountry = input.WarehouseCountry
		store.WarehousePostalCode = input.WarehousePostalCode
		store.WarehouseLatitude = input.WarehouseLatitude
		store.WarehouseLongitude = input.WarehouseLongitude

		if err := db.Save(&store).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to update store"})
		}

		return c.JSON(store)
	}
}

func CreateStoreHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthenticated"})
		}

		var input models.Store
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
		}

		store := models.Store{
			ID:          uuid.New(),
			OwnerID:     user.ID,
			Name:        input.Name,
			Description: input.Description,
		}

		if err := db.Create(&store).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to create store"})
		}

		return c.Status(fiber.StatusCreated).JSON(store)
	}
}

func ListStoresHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var stores []models.Store
		if err := db.Find(&stores).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch stores"})
		}

		return c.JSON(stores)
	}
}

func GetUserStoresHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthenticated"})
		}

		var stores []models.Store
		if err := db.Where("owner_id = ?", user.ID).Find(&stores).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch stores"})
		}

		return c.JSON(stores)
	}
}