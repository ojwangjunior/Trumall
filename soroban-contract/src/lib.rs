#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, String, Symbol};

// Data structures for recording activities
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Payment {
    pub order_id: String,
    pub amount_cents: i64,
    pub currency: String,
    pub mpesa_receipt: String,
    pub timestamp: u64,
    pub status: String,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Order {
    pub order_id: String,
    pub buyer_id: String,
    pub store_id: String,
    pub total_cents: i64,
    pub status: String,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Product {
    pub product_id: String,
    pub store_id: String,
    pub title: String,
    pub price_cents: i64,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Store {
    pub store_id: String,
    pub owner_id: String,
    pub name: String,
    pub timestamp: u64,
}

const PAYMENT_COUNT: Symbol = symbol_short!("PAY_CNT");
const ORDER_COUNT: Symbol = symbol_short!("ORD_CNT");
const PRODUCT_COUNT: Symbol = symbol_short!("PRD_CNT");
const STORE_COUNT: Symbol = symbol_short!("STR_CNT");

#[contract]
pub struct TrustMallContract;

#[contractimpl]
impl TrustMallContract {
    /// Record a payment transaction on the blockchain
    pub fn record_payment(
        env: Env,
        order_id: String,
        amount_cents: i64,
        currency: String,
        mpesa_receipt: String,
        status: String,
    ) -> String {
        let timestamp = env.ledger().timestamp();

        let payment = Payment {
            order_id: order_id.clone(),
            amount_cents,
            currency,
            mpesa_receipt,
            timestamp,
            status,
        };

        // Increment counter
        let mut count: u32 = env.storage().instance().get(&PAYMENT_COUNT).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&PAYMENT_COUNT, &count);

        // Store payment data
        let key = (symbol_short!("PAYMENT"), count);
        env.storage().persistent().set(&key, &payment);

        // Extend TTL for 30 days (in ledgers, ~5 seconds per ledger = 518400 ledgers)
        env.storage().persistent().extend_ttl(&key, 100, 518400);

        order_id
    }

    /// Record an order on the blockchain
    pub fn record_order(
        env: Env,
        order_id: String,
        buyer_id: String,
        store_id: String,
        total_cents: i64,
        status: String,
    ) -> String {
        let timestamp = env.ledger().timestamp();

        let order = Order {
            order_id: order_id.clone(),
            buyer_id,
            store_id,
            total_cents,
            status,
            timestamp,
        };

        // Increment counter
        let mut count: u32 = env.storage().instance().get(&ORDER_COUNT).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&ORDER_COUNT, &count);

        // Store order data
        let key = (symbol_short!("ORDER"), count);
        env.storage().persistent().set(&key, &order);
        env.storage().persistent().extend_ttl(&key, 100, 518400);

        order_id
    }

    /// Update order status
    pub fn update_order_status(env: Env, order_id: String, new_status: String) -> bool {
        // In production, you'd want to search for the order and update it
        // For now, we'll record the status change as a new entry
        let timestamp = env.ledger().timestamp();
        let key = (symbol_short!("ORD_UPD"), order_id.clone(), timestamp);
        env.storage().persistent().set(&key, &new_status);
        env.storage().persistent().extend_ttl(&key, 100, 518400);
        true
    }

    /// Record a product listing for authenticity verification
    pub fn record_product(
        env: Env,
        product_id: String,
        store_id: String,
        title: String,
        price_cents: i64,
    ) -> String {
        let timestamp = env.ledger().timestamp();

        let product = Product {
            product_id: product_id.clone(),
            store_id,
            title,
            price_cents,
            timestamp,
        };

        // Increment counter
        let mut count: u32 = env.storage().instance().get(&PRODUCT_COUNT).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&PRODUCT_COUNT, &count);

        // Store product data
        let key = (symbol_short!("PRODUCT"), count);
        env.storage().persistent().set(&key, &product);
        env.storage().persistent().extend_ttl(&key, 100, 518400);

        product_id
    }

    /// Record store creation
    pub fn record_store(
        env: Env,
        store_id: String,
        owner_id: String,
        name: String,
    ) -> String {
        let timestamp = env.ledger().timestamp();

        let store = Store {
            store_id: store_id.clone(),
            owner_id,
            name,
            timestamp,
        };

        // Increment counter
        let mut count: u32 = env.storage().instance().get(&STORE_COUNT).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&STORE_COUNT, &count);

        // Store data
        let key = (symbol_short!("STORE"), count);
        env.storage().persistent().set(&key, &store);
        env.storage().persistent().extend_ttl(&key, 100, 518400);

        store_id
    }

   