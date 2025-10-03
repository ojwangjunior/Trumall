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
	ID                uuid.UUID      `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	BuyerID           uuid.UUID      `gorm:"type:uuid;index" json:"buyer_id"`
	StoreID           uuid.UUID      `gorm:"type:uuid;index" json:"store_id"`
	ShippingAddressID uuid.UUID      `gorm:"type:uuid;index" json:"shipping_address_id"` // New field
	TotalCents        int64          `json:"total_cents"`
	ShippingCostCents int64          `gorm:"default:0" json:"shipping_cost_cents"` // New field
	Currency          string         `gorm:"default:USD" json:"currency"`
	Status            string         `gorm:"default:pending" json:"status"`
	ShippingMethod    string         `gorm:"size:50" json:"shipping_method"` // New field
	EstimatedDelivery time.Time      `json:"estimated_delivery"`             // New field
	CreatedAt         time.Time      `json:"created_at"`
	UpdatedAt         time.Time      `json:"updated_at"`
	OrderItems        []OrderItem    `gorm:"foreignKey:OrderID" json:"order_items"`
	Buyer             User           `gorm:"foreignKey:BuyerID" json:"buyer"`
	ShippingAddress   Address        `gorm:"foreignKey:ShippingAddressID" json:"shipping_address"` // New field
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

	// UX Enhancement Fields
	KeyFeatures        pq.StringArray `gorm:"type:text[]" json:"key_features,omitempty"`
	Specifications     *string        `gorm:"type:jsonb" json:"specifications,omitempty"` // JSON object like {"Brand": "Samsung", "Size": "15.6 inch"}
	AverageRating      float64        `gorm:"default:0" json:"average_rating"`
	ReviewCount        int            `gorm:"default:0" json:"review_count"`
	RatingBreakdown    *string        `gorm:"type:jsonb" json:"rating_breakdown,omitempty"` // JSON like {"5": 60, "4": 25, "3": 10, "2": 3, "1": 2}

	// Additional Detail Fields
	Brand              *string        `json:"brand,omitempty"`
	WhatsInBox         pq.StringArray `gorm:"type:text[]" json:"whats_in_box,omitempty"`
	WarrantyInfo       *string        `json:"warranty_info,omitempty"`
	OriginalPriceCents *int64         `json:"original_price_cents,omitempty"`
	Discount           *int           `json:"discount,omitempty"`

	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	Images           []ProductImage `gorm:"foreignKey:ProductID" json:"images"`
	Reviews          []Review       `gorm:"foreignKey:ProductID" json:"reviews,omitempty"`
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
	ID               uuid.UUID      `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	ProductID        uuid.UUID      `gorm:"type:uuid;index" json:"product_id"`
	UserID           uuid.UUID      `gorm:"type:uuid;index" json:"user_id"`
	Rating           int            `gorm:"not null" json:"rating"` // 1-5
	Comment          *string        `json:"comment,omitempty"`
	Images           pq.StringArray `gorm:"type:text[]" json:"images,omitempty"` // Array of image URLs
	VerifiedPurchase bool           `gorm:"default:false" json:"verified_purchase"`
	UserName         string         `json:"user_name"` // Cached user name for display
	CreatedAt        time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt        time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
}
type Store struct {
	ID                   uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	OwnerID              uuid.UUID `gorm:"type:uuid;index" json:"owner_id"`
	Name                 string    `gorm:"not null" json:"name"`
	Description          *string   `json:"description,omitempty"`
	// Warehouse/Origin Location for Shipping
	WarehouseStreet      string  `gorm:"size:255" json:"warehouse_street,omitempty"`
	WarehouseCity        string  `gorm:"size:100" json:"warehouse_city,omitempty"`
	WarehouseState       string  `gorm:"size:100" json:"warehouse_state,omitempty"`
	WarehouseCountry     string  `gorm:"size:100;default:KE" json:"warehouse_country,omitempty"`
	WarehousePostalCode  string  `gorm:"size:20" json:"warehouse_postal_code,omitempty"`
	WarehouseLatitude    float64 `json:"warehouse_latitude,omitempty"`
	WarehouseLongitude   float64 `json:"warehouse_longitude,omitempty"`
	CreatedAt            time.Time `json:"created_at"`
	Products             []Product `gorm:"foreignKey:StoreID" json:"products"`
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
	CreatedAt  time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

type ShippingMethod struct {
	ID              uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	Name            string    `gorm:"size:50;not null;uniqueIndex" json:"name"`
	Code            string    `gorm:"size:20;not null;uniqueIndex" json:"code"`
	Description     *string   `json:"description,omitempty"`
	BaseCostCents   int64     `gorm:"not null;default:0" json:"base_cost_cents"`
	CostPerKgCents  int64     `gorm:"default:0" json:"cost_per_kg_cents"`
	DeliveryDaysMin int       `gorm:"not null;default:1" json:"delivery_days_min"`
	DeliveryDaysMax int       `gorm:"not null;default:3" json:"delivery_days_max"`
	IsActive        bool      `gorm:"not null;default:true" json:"is_active"`
	CreatedAt       time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt       time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

type ShippingZone struct {
	ID                   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	Name                 string    `gorm:"size:100;not null" json:"name"`
	Country              string    `gorm:"size:100;not null;default:Kenya" json:"country"`
	State                *string   `gorm:"size:100" json:"state,omitempty"`
	City                 *string   `gorm:"size:100" json:"city,omitempty"`
	PostalCodePattern    *string   `gorm:"size:50" json:"postal_code_pattern,omitempty"`
	AdditionalCostCents  int64     `gorm:"not null;default:0" json:"additional_cost_cents"`
	IsActive             bool      `gorm:"not null;default:true" json:"is_active"`
	Priority             int       `gorm:"not null;default:0" json:"priority"`
	CreatedAt            time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt            time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

type ShippingRule struct {
	ID                         uuid.UUID       `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	ShippingMethodID           uuid.UUID       `gorm:"type:uuid;not null" json:"shipping_method_id"`
	ShippingZoneID             uuid.UUID       `gorm:"type:uuid;not null" json:"shipping_zone_id"`
	CostOverrideCents          *int64          `json:"cost_override_cents,omitempty"`
	MinOrderValueCents         int64           `gorm:"default:0" json:"min_order_value_cents"`
	MaxOrderValueCents         *int64          `json:"max_order_value_cents,omitempty"`
	FreeShippingThresholdCents *int64          `json:"free_shipping_threshold_cents,omitempty"`
	IsAvailable                bool            `gorm:"not null;default:true" json:"is_available"`
	CreatedAt                  time.Time       `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt                  time.Time       `gorm:"autoUpdateTime" json:"updated_at"`
	ShippingMethod             ShippingMethod  `gorm:"foreignKey:ShippingMethodID" json:"shipping_method"`
	ShippingZone               ShippingZone    `gorm:"foreignKey:ShippingZoneID" json:"shipping_zone"`
}

type Favorite struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`
	ProductID uuid.UUID `gorm:"type:uuid;not null;index" json:"product_id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
}
