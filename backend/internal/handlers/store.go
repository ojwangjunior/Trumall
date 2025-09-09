package handlers

import (
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// Create a new store
func CreateStoreHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		