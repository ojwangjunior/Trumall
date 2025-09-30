package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type OrderItem struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	OrderID        uuid.UUID `gorm:"type:uuid;index" json:"order_id"`
	ProductID      uuid.UUID `gorm:"type:uuid;index" json:"product_id"`
	UnitPriceCents int64     `json:"unit_price_cents"`
	Quantity       int       `json:"quantity"`
	Product        Product   `gorm:"foreignKey:ProductID" json:"product"`
}
type Order struct {
	ID         uuid.UUID   `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	BuyerID    uuid.UUID   `gorm:"type:uuid;index" json:"buyer_id"`
	StoreID    uuid.UUID   `gorm:"type:uuid;index" json:"store_id"`
	TotalCents int64       `json:"total_cents"`
	Currency   string      `gorm:"default:USD" json:"currency"`
	Status     string      `gorm:"default:pending" json:"status"`
	CreatedAt  time.Time   `json:"created_at"`
	UpdatedAt  time.Time   `json:"updated_at"`
	OrderItems []OrderItem `gorm:"foreignKey:OrderID" json:"order_items"`
	Buyer      User        `gorm:"foreignKey:BuyerID" json:"buyer"`
}
type Payment struct {
	ID                uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	OrderID           uuid.UUID `gorm:"type:uuid;not null"`
	Provider          string    `gorm:"not null"`
	ProviderTxID      *string   // e.g. Stripe ID or generic provider ref
	AmountCents       int64     `gorm:"not null"`
	Currency          string    `gorm:"default:'KES'"`
	Status            string    `gorm:"default:'initiated'"` // initiated | pending | paid | failed
	Phone             *string   // customer phone
	CheckoutRequestID *string   // M-Pesa STK request ID
	MpesaReceipt      *string   // M-Pesa receipt number from callback
	SorobanTxID       *string   // Stellar Soroban tx id
	CreatedAt         time.Time `gorm:"autoCreateTime"`
	UpdatedAt         time.Time `gorm:"autoUpdateTime"`
}
type Product struct {
	ID               uuid.UUID      `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	StoreID          uuid.UUID      `gorm:"type:uuid;index" json:"store_id"`
	Title            string         `gorm:"not null" json:"title"`
	Description      *string        `json:"description,omitempty"`
	PriceCents       int64          `gorm:"not null" json:"price_cents"`
	Currency         string         `gorm:"default:KES" json:"currency"`
	SKU              *string        `json:"sku,omitempty"`
	Stock            int            `gorm:"default:0" json:"stock"`
	AuthenticityHash *string        `json:"authenticity_hash,omitempty"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	Images           []ProductImage `gorm:"foreignKey:ProductID" json:"images"`
	// Back-reference: Many products belong to one store
	Store Store `gorm:"foreignKey:StoreID" json:"store"`
}

type ProductImage struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	ProductID uuid.UUID `gorm:"type:uuid;index" json:"product_id"`
	ImageURL  string    `gorm:"not null" json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
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
	Addresses    []Address      `json:"addresses" gorm:"foreignKey:UserID"`
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

// STK Callback Wrapper matches the whole payload from Safaricom
type StkCallbackWrapper struct {
	Body struct {
		StkCallback struct {
			MerchantRequestID string `json:"MerchantRequestID"`
			CheckoutRequestID string `json:"CheckoutRequestID"`
			ResultCode        int    `json:"ResultCode"`
			ResultDesc        string `json:"ResultDesc"`
			CallbackMetadata  struct {
				Item []struct {
					Name  string      `json:"Name"`
					Value interface{} `json:"Value,omitempty"`
				} `json:"Item"`
			} `json:"CallbackMetadata"`
		} `json:"stkCallback"`
	} `json:"Body"`
}

type StkCallbackBody struct {
	StkCallback StkCallback `json:"stkCallback"`
}

type StkCallback struct {
	MerchantRequestID string            `json:"MerchantRequestID"`
	CheckoutRequestID string            `json:"CheckoutRequestID"`
	ResultCode        int               `json:"ResultCode"`
	ResultDesc        string            `json:"ResultDesc"`
	CallbackMetadata  *CallbackMetadata `json:"CallbackMetadata,omitempty"`
}

type CallbackMetadata struct {
	Item []CallbackItem `json:"Item"`
}

type CallbackItem struct {
	Name  string      `json:"Name"`
	Value interface{} `json:"Value,omitempty"`
}

type Address struct {
	ID         uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID     uuid.UUID      `gorm:"type:uuid;not null" json:"user_id"`
	Label      string         `gorm:"size:50" json:"label"`
	Street     string         `gorm:"size:255;not null" json:"street"`
	City       string         `gorm:"size:100;not null" json:"city"`
	State      string         `gorm:"size:100" json:"state"`
	Country    string         `gorm:"size:100;default:Kenya" json:"country"`
	PostalCode string         `gorm:"size:20" json:"postal_code"`
	Latitude   float64        `json:"latitude"`
	Longitude  float64        `json:"longitude"`
	IsDefault  bool           `gorm:"not null;default:false" json:"is_default"`
