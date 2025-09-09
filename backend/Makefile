.PHONY: up down migrate-up migrate-down run build


up:
docker-compose up -d
docker-compose ps


down:
docker-compose down


migrate-up:
migrate -path ./migrations -database "postgres://$(DB_USER):$(DB_PASS)@localhost:$(DB_PORT)/$(DB_NAME)?sslmode=disable" up


migrate-down:
migrate -path ./migrations -database "postgres://$(DB_USER):$(DB_PASS)@localhost:$(DB_PORT)/$(DB_NAME)?sslmode=disable" down 1


run:
go run ./cmd/server


build:
go build -o bin/trustmall ./cmd/server