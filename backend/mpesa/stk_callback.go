package mpesa

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"trumall/internal/models"
)

func StkCallbackHandler(dbConn *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var cb models.StkCallbackWrapper
		