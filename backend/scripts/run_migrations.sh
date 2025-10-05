#!/bin/bash

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
elif [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Database connection string
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable"

echo "Running migrations..."
echo "Database: $DB_NAME"
echo ""

# Run migrations 13, 14, 15
for migration in 000013 000014 000015; do
    echo "Applying migration ${migration}..."

    # Read the up migration file
    if [ -f "../migrations/${migration}_*.up.sql" ]; then
        psql "$DATABASE_URL" -f ../migrations/${migration}_*.up.sql
        if [ $? -eq 0 ]; then
            echo "✅ Migration ${migration} applied successfully"
        else
            echo "❌ Migration ${migration} failed"
            exit 1
        fi
    fi
done

echo ""
echo "All migrations completed!"
