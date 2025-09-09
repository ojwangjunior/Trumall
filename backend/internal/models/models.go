package models

import (
	"time"

	"github.com/google/uuid"
)

type OrderItem struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	OrderID        uuid.UUID `gorm:"type:uuid;index" json:"order_id"`
	ProductID      uuid.UUID `gorm:"type:uuid;index" json:"product_id"`
	UnitPriceCents int64     `json:"unit_price_cents"`
	Quantity       int       `json:"quantity"`
}
type Order struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	BuyerID    uuid.UUID `gorm:"type:uuid;index" json:"buyer_id"`
	StoreID    uuid.UUID `gorm:"type:uuid;index" json:"store_id"`
	TotalCents int64     `json:"total_cents"`
	Currency   string    `gorm:"default:USD" json:"currency"`
	Status     string    `gorm:"default:pending" json:"status"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
type Payment struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	OrderID      uuid.UUID `gorm:"type:uuid;index" json:"order_id"`
	Provider     string    `json:"provider"`
	ProviderTxID *string   `json:"provider_tx_id,omitempty"`
	AmountCents  int64     `json:"amount_cents"`
	Currency     string    `gorm:"default:USD" json:"currency"`
	Status       string    `gorm:"default:initiated" json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
