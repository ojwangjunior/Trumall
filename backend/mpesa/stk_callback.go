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
		if err := json.Unmarshal(c.Body(), &cb); err != nil {
			log.Println("callback decode err:", err)
			return c.Status(fiber.StatusBadRequest).SendString("invalid payload")
		}

		sc := cb.Body.StkCallback
		if sc.ResultCode == 0 {
			var amount int
			var receipt, phone string
			for _, it := range sc.CallbackMetadata.Item {
				n := strings.ToLower(it.Name)
				switch n {
				case "amount":
					if v, ok := it.Value.(float64); ok {
						amount = int(v)
					}
				case "mpesareceiptnumber":
					if v, ok := it.Value.(string); ok {
						receipt = v
					}
				case "phonenumber", "phone":
					switch v := it.Value.(type) {
					case float64:
						phone = fmt.Sprintf("254%d", int64(v))
					case string:
						phone = v
					}
				}
			}

			// Update DB
			if err := dbConn.Model(&models.Payment{}).
				