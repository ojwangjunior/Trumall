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

#