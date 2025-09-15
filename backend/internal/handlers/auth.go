package handlers

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/lib/pq"
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
			Roles:        pq.StringArray{role},
		}
		if err := db.Create(&user).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create user"})
		}

		// generate JWT with role claim
		token, err := generateToken(user.ID.String(), user.Roles)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create token"})
		}
		return c.JSON(fiber.Map{
			"message": "account created successfully",
			"token":   token,
		})
	}
}

func LoginHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		if err := c.BodyParser(&body); err != nil {
			return fiber.ErrBadRequest
		}
		var user models.User
		if err := db.Where("email = ?", body.Email).First(&user).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(401).JSON(fiber.Map{"error": "invalid credentials"})
			}
			return c.Status(500).JSON(fiber.Map{"error": "db error"})
		}
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(body.Password)); err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "invalid credentials"})
		}
		token, err := generateToken(user.ID.String(), user.Roles)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "token"})
		}
		return c.JSON(fiber.Map{
			"message": "login successfully",
			"token":   token,
		})
	}
}

func generateToken(sub string, roles []string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "devsecret"
	}

	claims := jwt.MapClaims{
		"sub":   sub,
		"roles": roles, // store array of roles
		"exp":   time.Now().Add(72 * time.Hour).Unix(),
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(secret))
}

func GetMeHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
		}
		return c.JSON(user)
	}
}
