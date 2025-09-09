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

	// // Fiber app
	// app := fiber.New()

	// // ✅ Root health-check
	// app.Get("/", func(c *fiber.Ctx) error {
	// 	return c.JSON(fiber.Map{
	// 		"status":  "ok",
	// 		"message": "TrustMall API is running 🚀",
	// 	})
	// })

	

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("listening on :%s\n", port)
	log.Fatal(app.Listen(":" + port))
}
