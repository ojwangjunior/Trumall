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
		var tokenStr string
		_, err := fmt.Sscanf(auth, "Bearer %s", &tokenStr)
		if err != nil || tokenStr == "" {
			return c.Status(401).JSON(fiber.Map{"error": "invalid auth header"})
		}

		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			return c.Status(500).JSON(fiber.Map{"error": "server misconfigured (no jwt secret)"})
		}
		// parse and validate token
		tok, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			// ensure signing method
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.ErrUnauthorized
			}
			return []byte(secret), nil
		})
		if err != nil || !tok.Valid {
			return c.Status(401).JSON(fiber.Map{"error": "invalid token"})
		}

		claims, ok := tok.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "invalid token claims"})
		}

		sub, ok := claims["sub"].(string)
		if !ok || sub == "" {
			return c.Status(401).JSON(fiber.Map{"error": "invalid token subject"})
		}
		uid, err := uuid.Parse(sub)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "invalid user id in token"})
		}

		// --- NEW: read roles array ---
		rolesAny, exists := claims["roles"]
		if !exists {
			return c.Status(401).JSON(fiber.Map{"error": "roles claim missing"})
		}

		roles := []string{}
		switch v := rolesAny.(type) {
		case []interface{}:
			for _, r := range v {
				s, ok := r.(string)
				if !ok {
					return c.Status(401).JSON(fiber.Map{"error": "invalid role type in token"})
				}
				roles = append(roles, s)
			}
		case []string:
			roles = v
		default:
			return c.Status(401).JSON(fiber.Map{"error": "invalid roles format"})
		}

		if len(roles) == 0 {
			return c.Status(401).JSON(fiber.Map{"error": "no valid roles in token"})
		}

		// attach to context
		c.Locals("user_id", uid)
		c.Locals("user_roles", roles)

		return c.Next()
	}
}

// RequireRole ensures the user has the given role (e.g. "seller")
func RequireRole(role string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		rolesAny := c.Locals("user_roles")
		if rolesAny == nil {
			return c.Status(403).JSON(fiber.Map{"error": "forbidden"})
		}
		roles, ok := rolesAny.([]string)
		if !ok {
			return c.Status(500).JSON(fiber.Map{"error": "invalid roles"})
		}
		for _, r := range roles {
			if r == role {
				return c.Next()
			}
		}
		return c.Status(403).JSON(fiber.Map{"error": "forbidden: insufficient role"})
	}
}
