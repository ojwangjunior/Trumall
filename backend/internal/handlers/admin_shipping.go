package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// Admin: Create Shipping Method
func CreateShippingMethodHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var method models.ShippingMethod
		if err := c.BodyParser(&method); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
		}

		if err := db.Create(&method).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create shipping method"})
		}

		return c.Status(201).JSON(method)
	}
}

// Admin: Update Shipping Method
func UpdateShippingMethodHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		methodID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid method id"})
		}

		var method models.ShippingMethod
		if err := db.First(&method, "id = ?", methodID).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "shipping method not found"})
		}

		if err := c.BodyParser(&method); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
		}

		if err := db.Save(&method).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to update shipping method"})
		}

		return c.JSON(method)
	}
}

// Admin: Delete Shipping Method
func DeleteShippingMethodHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		methodID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid method id"})
		}

		if err := db.Delete(&models.ShippingMethod{}, "id = ?", methodID).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to delete shipping method"})
		}

		return c.JSON(fiber.Map{"message": "shipping method deleted"})
	}
}

// Admin: List All Shipping Methods (including inactive)
func AdminListShippingMethodsHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var methods []models.ShippingMethod
		if err := db.Order("name ASC").Find(&methods).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to fetch shipping methods"})
		}

		return c.JSON(methods)
	}
}

// Admin: Create Shipping Zone
func CreateShippingZoneHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var zone models.ShippingZone
		if err := c.BodyParser(&zone); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
		}

		if err := db.Create(&zone).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create shipping zone"})
		}

		return c.Status(201).JSON(zone)
	}
}

// Admin: Update Shipping Zone
func UpdateShippingZoneHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		zoneID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid zone id"})
		}

		var zone models.ShippingZone
		if err := db.First(&zone, "id = ?", zoneID).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "shipping zone not found"})
		}

		if err := c.BodyParser(&zone); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
		}

		if err := db.Save(&zone).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to update shipping zone"})
		}

		return c.JSON(zone)
	}
}

// Admin: Delete Shipping Zone
func DeleteShippingZoneHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		zoneID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid zone id"})
		}

		if err := db.Delete(&models.ShippingZone{}, "id = ?", zoneID).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to delete shipping zone"})
		}

		return c.JSON(fiber.Map{"message": "shipping zone deleted"})
	}
}

// Admin: List All Shipping Zones
func ListShippingZonesHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var zones []models.ShippingZone
		if err := db.Order("priority ASC, name ASC").Find(&zones).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to fetch shipping zones"})
		}

		return c.JSON(zones)
	}
}

// Admin: Create Shipping Rule
func CreateShippingRuleHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var rule models.ShippingRule
		if err := c.BodyParser(&rule); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
		}

		if err := db.Create(&rule).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create shipping rule"})
		}

		return c.Status(201).JSON(rule)
	}
}

// Admin: Update Shipping Rule
func UpdateShippingRuleHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		ruleID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid rule id"})
		}

		var rule models.ShippingRule
		if err := db.First(&rule, "id = ?", ruleID).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "shipping rule not found"})
		}

		if err := c.BodyParser(&rule); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
		}

		if err := db.Save(&rule).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to update shipping rule"})
		}

		return c.JSON(rule)
	}
}

// Admin: Delete Shipping Rule
func DeleteShippingRuleHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		ruleID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid rule id"})
		}

		if err := db.Delete(&models.ShippingRule{}, "id = ?", ruleID).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to delete shipping rule"})
		}

		return c.JSON(fiber.Map{"message": "shipping rule deleted"})
	}
}

// Admin: List All Shipping Rules
func ListShippingRulesHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var rules []models.ShippingRule
		if err := db.Preload("ShippingMethod").Preload("ShippingZone").Find(&rules).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to fetch shipping rules"})
		}

		return c.JSON(rules)
	}
}
