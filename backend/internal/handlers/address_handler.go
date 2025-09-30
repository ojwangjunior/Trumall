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
		