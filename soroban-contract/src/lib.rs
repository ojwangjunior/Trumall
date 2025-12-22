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

     