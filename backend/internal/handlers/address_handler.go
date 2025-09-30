package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"trumall/internal/db"
	"trumall/internal/models"
)

// Create new address
func CreateAddress(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID) // ✅ updated

	var input models.Address
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	input.ID = uuid.New()
	input.UserID = userID

	// If first address for user, set default automatically
	var count int64
	db.DB.Model(&models.Address{}).Where("user_id = ?", userID).Count(&count)
	if count == 0 {
		input.IsDefault = true
	}

	if err := db.DB.Create(&input).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not save address",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(input)
}

// Get all addresses
func GetAddresses(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)

	var addresses []models.Address
	if err := db.DB.Where("user_id = ?", userID).Find(&addresses).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not fetch addresses",
		})
	}

	return c.JSON(addresses)
}

// Update address
func UpdateAddress(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID) // ✅ updated
	idParam := c.Params("id")

	addressID, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid address ID"})
	}

	var address models.Address
	if err := db.DB.Where("id = ? AND user_id = ?", addressID, userID).First(&address).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Address not found",
		})
	}

	if err := c.BodyParser(&address); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := db.DB.Save(&address).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not update address",
		})
	}

	return c.JSON(address)
}

// Get default address
func GetDefaultAddress(c *fiber.Ctx) error {
	uid, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return c.Status(500).JSON(fiber.Map{"error": "user_id missing or wrong type"})
	}

	