package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

	"trumall/internal/db"
	"trumall/internal/handlers"
	"trumall/internal/middleware"
)

func main() {
	// Load env vars
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file loaded, using environment")
	}

	// Connect DB
	dbConn, err := db.Connect()
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}

	// Fiber app
	app := fiber.New()

	// ✅ Root health-check
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "TrustMall API is running 🚀",
		})
	})

	// Auth
	app.Post("/api/auth/register", handlers.RegisterHandler(dbConn))
	app.Post("/api/auth/login", handlers.LoginHandler(dbConn))

	// Products
	app.Post("/api/products", middleware.RequireAuth(), handlers.CreateProductHandler(dbConn))
	app.Get("/api/products", handlers.ListProductsHandler(dbConn))
	app.Post("/api/stores/:id/products", middleware.RequireAuth(), middleware.RequireRole("seller"), handlers.CreateProductHandler(dbConn))

	// Orders
	app.Post("/api/orders", middleware.RequireAuth(), handlers.CreateOrderHandler(dbConn))

	
	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("listening on :%s\n", port)
	log.Fatal(app.Listen(":" + port))
}
