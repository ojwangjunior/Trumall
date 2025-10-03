package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// AddToFavoritesHandler adds a product to user's favorites
func AddToFavoritesHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthenticated"})
		}

		var req struct {
			ProductID string `json:"product_id"`
		}

		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
		}

		productID, err := uuid.Parse(req.ProductID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid product ID"})
		}

		// Check if product exists
		var product models.Product
		if err := db.First(&product, "id = ?", productID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "database error"})
		}

		// Check if already in favorites
		var existingFav models.Favorite
		err = db.Where("user_id = ? AND product_id = ?", user.ID, productID).First(&existingFav).Error
		if err == nil {
			return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "already in favorites", "favorite": existingFav})
		} else if err != gorm.ErrRecordNotFound {
			// Return error only if it's not a "not found" error
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "database error"})
		}

		// Add to favorites
		favorite := models.Favorite{
			ID:        uuid.New(),
			UserID:    user.ID,
			ProductID: productID,
		}

		if err := db.Create(&favorite).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to add to favorites"})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "added to favorites", "favorite": favorite})
	}
}

// RemoveFromFavoritesHandler removes a product from user's favorites
func RemoveFromFavoritesHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthenticated"})
		}

		productID, err := uuid.Parse(c.Params("productId"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid product ID"})
		}

		// Delete the favorite
		result := db.Where("user_id = ? AND product_id = ?", user.ID, productID).Delete(&models.Favorite{})
		if result.Error != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to remove from favorites"})
		}

		if result.RowsAffected == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "favorite not found"})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "removed from favorites"})
	}
}

// GetUserFavoritesHandler retrieves all favorites for the authenticated user
func GetUserFavoritesHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthenticated"})
		}

		var favorites []models.Favorite
		if err := db.Preload("Product").Preload("Product.Images").Preload("Product.Store").
			Where("user_id = ?", user.ID).
			Order("created_at DESC").
			Find(&favorites).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch favorites"})
		}

		return c.JSON(favorites)
	}
}

// CheckFavoriteStatusHandler checks if a product is in user's favorites
func CheckFavoriteStatusHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthenticated"})
		}

		productID, err := uuid.Parse(c.Params("productId"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid product ID"})
		}

		var favorite models.Favorite
		err = db.Where("user_id = ? AND product_id = ?", user.ID, productID).First(&favorite).Error

		if err == gorm.ErrRecordNotFound {
			return c.JSON(fiber.Map{"is_favorite": false})
		}

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "database error"})
		}

		return c.JSON(fiber.Map{"is_favorite": true, "favorite_id": favorite.ID})
	}
}
