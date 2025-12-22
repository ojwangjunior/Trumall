package db

import (
	"fmt"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	migratedb "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() (*gorm.DB, error) {
	// Build the DSN from .env variables
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASS")
	dbname := os.Getenv("DB_NAME")

	if host == "" || port == "" || user == "" || dbname == "" {
		return nil, fmt.Errorf("database configuration is incomplete: DB_HOST=%s, DB_PORT=%s, DB_USER=%s, DB_NAME=%s", host, port, user, dbname)
	}

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	// Open the database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("[error] failed to initialize database, got error: %v", err)
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("failed to get sql.DB: %v", err)
	}

	driver, err := migratedb.WithInstance(sqlDB, &migratedb.Config{})
	if err != nil {
		log.Fatalf("failed to create driver: %v", err)
	}

	// Find migrations path
	migrationsPath := "file://migrations"
	paths := []string{"migrations", "../../migrations", "../../../migrations"}
	var found bool
	for _, p := range paths {
		if _, err := os.Stat(p); err == nil {
			migrationsPath = "file://" + p
			found = true
			break
		}
	}

	if !found {
		log.Println("Warning: migrations directory not found in expected locations.")
	}

	m, err := migrate.NewWithDatabaseInstance(
		migrationsPath,
		"postgres",
		driver,
	)
	if err != nil {
		log.Fatalf("failed to create migrate instance: %v (path: %s)", err, migrationsPath)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("failed to run migrations: %v", err)
	}
	DB = db 
	
	return db, nil
}
