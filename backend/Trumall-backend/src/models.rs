use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub password_hash: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Item {
    pub id: String,
    pub name: String,
    pub price: u64,
    pub description: String,
}

#[derive(Clone)]
pub struct CartItem {
    pub item: Item,
    pub quantity: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TransactionType {
    Buy,
    Sell,
    Transfer,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TransactionStatus {
    Pending,
    Completed,
    Failed,
    Canceled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    pub transaction_id: Uuid,
    pub user_id: Uuid,
    pub transaction_type: TransactionType,
    pub metadata: HashMap<String, serde_json::Value>,
    pub amount: u64,
    pub price: u64,
    pub quantity: u64,
    pub currency: String,
    pub status: TransactionStatus,
    pub item_id: Uuid,
    pub timestamp: DateTime<Utc>,
    pub transaction_fee: u64,
    pub transaction_fee_currency: String,
}

#[derive(Debug, Deserialize)]
pub struct SignupData {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginData {
    pub username: String,
    pub password: String,
}