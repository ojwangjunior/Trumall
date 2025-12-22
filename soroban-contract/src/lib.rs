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

