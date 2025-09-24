package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"trumall/internal/models"
)

// CreateProductHandler requires auth and checks that the authenticated user is the store owner.
func CreateProductHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Parse multipart form
		form, err := c.MultipartForm()
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "failed to parse form"})
		}

		// Get product data from form values
		storeIDStr := form.Value["store_id"][0]
		title := form.Value["title"][0]
		description := form.Value["description"][0]
		priceCentsStr := form.Value["price_cents"][0]
		currency := form.Value["currency"][0]
		stockStr := form.Value["stock"][0]

		// --- Validation ---
		if title == "" {
			return c.Status(400).JSON(fiber.Map{"error": "title is required"})
		}
		if len(title) > 255 {
			return c.Status(400).JSON(fiber.Map{"error": "title too long (max 255 characters)"})
		}
		priceCents, err := strconv.ParseInt(priceCentsStr, 10, 64)
		if err != nil || priceCents <= 0 {
			return c.Status(400).JSON(fiber.Map{"error": "valid price_cents required"})
		}
		stock, err := strconv.Atoi(stockStr)
		if err != nil || stock < 0 {
			return c.Status(400).JSON(fiber.Map{"error": "valid stock required"})
		}
		sid, err := uuid.Parse(storeIDStr)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid store id"})
		}

		// Get user from context
		user, ok := c.Locals("user").(models.User)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "unauthenticated"})
		}

		// Verify store ownership
		var store models.Store
		if err := db.First(&store, "id = ? AND owner_id = ?", sid, user.ID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(403).JSON(fiber.Map{"error": "you do not own this store"})
			}
			return c.Status(500).JSON(fiber.Map{"error": "database error"})
		}

		// Prepare product
		p := models.Product{
			ID:          uuid.New(),
			StoreID:     sid,
			Title:       title,
			Description: &description,
			PriceCents:  priceCents,
			Currency:    currency,
			Stock:       stock,
		}
		if p.Currency == "" {
			p.Currency = "USD"
		}

		// Handle image uploads
		files := form.File["images"]
		var productImages []models.ProductImage

		// Determine base upload directory from env (default ./public)
		baseUploadDir := os.Getenv("UPLOAD_DIR")
		if baseUploadDir == "" {
			baseUploadDir = "./public"
		}

		// Create the directory if it doesn't exist
		uploadPath := filepath.Join(baseUploadDir, "images", "products")
		if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create upload directory"})
		}

		for _, file := range files {
			// Validate file type
			ext := strings.ToLower(filepath.Ext(file.Filename))
			if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp" {
				return c.Status(400).JSON(fiber.Map{"error": "invalid image file type. only jpg, png, webp allowed"})
			}

			// Generate a new filename
			newFileName := fmt.Sprintf("%s%s", uuid.New().String(), ext)
			filePath := filepath.Join(uploadPath, newFileName)

			// Save the file
			if err := c.SaveFile(file, filePath); err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "failed to save image"})
			}

			// Build the public URL path consistently using forward slashes
			// e.g. /public/images/products/<file>
			webPath := filepath.ToSlash(filepath.Join(string(filepath.Separator), baseUploadDir, "images", "products", newFileName))

			productImages = append(productImages, models.ProductImage{
				ID:        uuid.New(),
				ProductID: p.ID,
				ImageURL:  webPath,
			})
		}
		p.Images = productImages

		// Create product and images in a transaction
		err = db.Transaction(func(tx *gorm.DB) error {
			if err := tx.Create(&p).Error; err != nil {
				return err
			}
			return nil
		})

		if err != nil {
			// If transaction fails, try to delete the saved files
			for _, img := range productImages {
				os.Remove(img.ImageURL[1:]) // remove the leading '/'
			}
			return c.Status(500).JSON(fiber.Map{"error": "failed to create product"})
		}

		// Preload associated data for the response
		db.Preload("Store").Preload("Images").First(&p, "id = ?", p.ID)
		return c.Status(201).JSON(p)
	}
}

// ListProductsHandler - list all products with store info and images
func ListProductsHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var products []models.Product

		if err := db.Preload("Store").Preload("Images").Find(&products).Error; err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch products"})
		}

		for i := range products {
			if products[i].Currency == "" {
				products[i].Currency = "USD"
			}
		}

		return c.JSON(products)
	}
}

// GetProductHandler - get a single product by ID with store info and images
func GetProductHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		productID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid product ID"})
		}

		var product models.Product
		if err := db.Preload("Store").Preload("Images").First(&product, "id = ?", productID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch product"})
		}

		if product.Currency == "" {
			product.Currency = "USD"
		}

		return c.JSON(product)
	}
}

func ListProductsByStoreHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		storeID := c.Params("id")
		parsedStoreID, err := uuid.Parse(storeID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid store ID"})
		}

		var products []models.Product
		if err := db.Preload("Store").Preload("Images").Where("store_id = ?", parsedStoreID).Find(&products).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch products for store"})
		}

		for i := range products {
			if products[i].Currency == "" {
				products[i].Currency = "USD"
			}
		}

		return c.JSON(products)
	}
}
