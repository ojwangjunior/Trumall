package handlers

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// RegisterHandler supports optional role field ("buyer" or "seller")
// In production, you may want to restrict seller creation or require approval.
func RegisterHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body struct {
			Email    string `json:"email"`
			Password string `json:"password"`
			Name     string `json:"name"`
			Role     string `json:"role"` // optional: "buyer" or "seller"
		}
		if err := c.BodyParser(&body); err != nil {
			return fiber.ErrBadRequest
		}
		if body.Email == "" || body.Password == "" {
			return c.Status(400).JSON(fiber.Map{"error": "email and password required"})
		}
		role := "buyer"
		if body.Role == "seller" {
			role = "seller"
		}

		// hash password
		pwHash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to hash password"})
		}

		// create user
		user := models.User{
			ID:           uuid.New(),
			Email:        body.Email,
			PasswordHash: string(pwHash),
			Name:         body.Name,
			Role:         role,
		}
		if err := db.Create(&user).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create user"})
		}

		