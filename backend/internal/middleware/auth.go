package middleware

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
)

// RequireAuth validates the Authorization header Bearer token and attaches user info to context
func RequireAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Get("Authorization")
		if auth == "" {
			return c.Status(401).JSON(fiber.Map{"error": "missing auth"})
		}
		// Expect: "Bearer <token>"
		
}

