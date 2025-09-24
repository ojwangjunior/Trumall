package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	"trumall/internal/db"
	"trumall/internal/handlers"
	"trumall/internal/middleware"
)

func main() {
	// Load env vars
	err := godotenv.Load("../../.env")
    if err != nil {
        log.Printf("Error loading ../../.env file: %v", err)
        log.Println("Trying current directory...")
        err = godotenv.Load(".env")
        if err != nil {
            log.Printf("Error loading .env from current dir: %v", err)
            log.Println("Using system environment variables")
        }
    } else {
        log.Println("Successfully loaded .env file")
    }

	// Connect DB
	dbConn, err := db.Connect()
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}

	// Fiber app
	app := fiber.New()

	// Enable CORS for all origins
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Serve static files
	app.Static("/public", "./public")

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
	app.Get("/api/me", middleware.RequireAuth(dbConn), handlers.GetMeHandler(dbConn))

	// STORES
	app.Post("/api/stores", middleware.RequireAuth(dbConn), handlers.CreateStoreHandler(dbConn))
	// list all stores
	app.Get("/api/stores", handlers.ListStoresHandler(dbConn))
	// get one store
	app.Get("/api/stores/:id", handlers.GetStoreHandler(dbConn))
	// get stores for the logged in user
	app.Get("/api/me/stores", middleware.RequireAuth(dbConn), handlers.GetUserStoresHandler(dbConn))
	app.Get("/api/my-stores", middleware.RequireAuth(dbConn), handlers.GetMyStoresHandler(dbConn))
	app.Put("/api/stores/:id", middleware.RequireAuth(dbConn), handlers.UpdateStoreHandler(dbConn))
	
	// Products
	app.Post("/api/products", middleware.RequireAuth(dbConn), handlers.CreateProductHandler(dbConn))
	app.Get("/api/products", handlers.ListProductsHandler(dbConn))
	app.Get("/api/products/:id", handlers.GetProductHandler(dbConn))
	app.Get("/api/stores/:id/products", handlers.ListProductsByStoreHandler(dbConn)) // New route to list products by store ID
	app.Post("/api/stores/:id/products", middleware.RequireAuth(dbConn), middleware.RequireRole("seller"), handlers.CreateProductHandler(dbConn))

	// Orders
	app.Post("/api/orders", middleware.RequireAuth(dbConn), handlers.CreateOrderHandler(dbConn))

	// Payments / Webhooks
	app.Post("/api/webhooks/payment", handlers.PaymentWebhookHandler(dbConn))

	//cart
	app.Post("/api/cart/add", middleware.RequireAuth(dbConn), handlers.AddToCartHandler(dbConn))
	app.Post("/api/cart/increase", middleware.RequireAuth(dbConn), handlers.IncreaseCartItemQuantityHandler(dbConn))
	app.Post("/api/cart/decrease", middleware.RequireAuth(dbConn), handlers.DecreaseCartItemQuantityHandler(dbConn))
	app.Get("/api/cart", middleware.RequireAuth(dbConn), handlers.GetCartHandler(dbConn))
	app.Delete("/api/cart/:id", middleware.RequireAuth(dbConn), handlers.RemoveFromCartHandler(dbConn))
	app.Post("/api/cart/checkout", middleware.RequireAuth(dbConn), handlers.CheckoutHandler(dbConn))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("listening on :%s\n", port)
	log.Fatal(app.Listen(":" + port))
}
