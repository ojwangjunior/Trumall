package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"trumall/internal/db"
	"trumall/internal/models"
	"trumall/internal/validation"
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

	// Validate address fields
	if err := validation.ValidateAddress(input.Street, input.City, input.State, input.Country, input.PostalCode); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Normalize country code
	input.Country = validation.NormalizeCountryCode(input.Country)

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

	var updateData models.Address
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate updated address fields
	if err := validation.ValidateAddress(updateData.Street, updateData.City, updateData.State, updateData.Country, updateData.PostalCode); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Normalize country code
	updateData.Country = validation.NormalizeCountryCode(updateData.Country)

	// Update fields
	address.Street = updateData.Street
	address.City = updateData.City
	address.State = updateData.State
	address.Country = updateData.Country
	address.PostalCode = updateData.PostalCode
	address.Label = updateData.Label
	address.Latitude = updateData.Latitude
	address.Longitude = updateData.Longitude

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

	fmt.Println("Looking for default address for user:", uid)

	var address models.Address
	err := db.DB.Where("user_id = ? AND is_default = ?", uid, true).First(&address).Error
	if err != nil {
		fmt.Println("DB query error:", err)
		return c.Status(404).JSON(fiber.Map{"error": "Default address not found"})
	}

	return c.JSON(address)
}

// Delete address
func DeleteAddress(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID) // ✅ updated
	idParam := c.Params("id")

	addressID, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid address ID"})
	}

	if err := db.DB.Where("id = ? AND user_id = ?", addressID, userID).Delete(&models.Address{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not delete address",
		})
	}

	return c.JSON(fiber.Map{"message": "Address deleted"})
}

// Set default address
func SetDefaultAddress(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID) // ✅ updated
	idParam := c.Params("id")

	addressID, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid address ID"})
	}

	// unset all previous defaults
	db.DB.Model(&models.Address{}).Where("user_id = ?", userID).Update("is_default", false)

	// set new default
	if err := db.DB.Model(&models.Address{}).Where("id = ? AND user_id = ?", addressID, userID).Update("is_default", true).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not set default address",
		})
	}

	return c.JSON(fiber.Map{"message": "Default address updated"})
}
