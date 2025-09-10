package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"trumall/internal/models"
)

func Connect() (*gorm.DB, error) {
	// Build the DSN from .env variables
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASS"),
		os.Getenv("DB_NAME"),
	)

	// Open the database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("[error] failed to initialize database, got error: %v", err)
		return nil, err
	}

	// Run migrations
	err = db.AutoMigrate(
		&models.User{},
		&models.Store{},
		&models.Product{},
		&models.Order{},
		&models.OrderItem{},
		&models.Payment{},
		&models.Review{},
		&models.CartItem{},
	)
	if err != nil {
		log.Fatalf("failed to migrate: %v", err)
	}

	return db, nil
}
