package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
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
type Product struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	StoreID          uuid.UUID `gorm:"type:uuid;index" json:"store_id"`
	Title            string    `gorm:"not null" json:"title"`
	Description      *string   `json:"description,omitempty"`
	PriceCents       int64     `gorm:"not null" json:"price_cents"`
	Currency         string    `gorm:"default:USD" json:"currency"`
	SKU              *string   `json:"sku,omitempty"`
	Stock            int       `gorm:"default:0" json:"stock"`
	AuthenticityHash *string   `json:"authenticity_hash,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	// Back-reference: Many products belong to one store
	Store Store `gorm:"foreignKey:StoreID" json:"store"`
}
type Review struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	ProductID uuid.UUID `gorm:"type:uuid;index" json:"product_id"`
	UserID    uuid.UUID `gorm:"type:uuid;index" json:"user_id"`
	Rating    int       `json:"rating"`
	Comment   *string   `json:"comment,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}
type Store struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	OwnerID     uuid.UUID `gorm:"type:uuid;index" json:"owner_id"`
	Name        string    `gorm:"not null" json:"name"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	Products    []Product `gorm:"foreignKey:StoreID" json:"products"`
}
type User struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	Email        string         `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string         `gorm:"not null" json:"-"`
	Name         string         `json:"name"`
	Roles        pq.StringArray `gorm:"type:text[]" json:"roles"` // ["buyer","seller"]
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}
type CartItem struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID    uuid.UUID `gorm:"type:uuid;not null"`
	ProductID uuid.UUID `gorm:"type:uuid;not null"`
	Quantity  int       `json:"quantity"`
	Price     int64     `json:"price"`
	Product   Product   `gorm:"foreignKey:ProductID"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
