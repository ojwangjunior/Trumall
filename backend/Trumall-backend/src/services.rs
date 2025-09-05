use crate::models::{Account, Transaction, TransactionStatus, TransactionType};
use std::collections::HashMap;
use uuid::Uuid;
use chrono::{Utc};

pub fn new_buy_transaction(
    user_id: Uuid,
    item_id: Uuid,
    price: u64,
    quantity: u64,
    currency: String,
    transaction_fees: u64,
    transaction_fee_currency: String,
    metadata: HashMap<String, serde_json::Value>,
) -> Transaction {
    Transaction {
        transaction_id: Uuid::new_v4(),
        user_id,
        transaction_type: TransactionType::Buy,
        metadata,
        amount: price * quantity,
        price,
        quantity,
        currency,
        status: TransactionStatus::Pending,
        item_id,
        timestamp: Utc::now(),
        transaction_fee: transaction_fees,
        transaction_fee_currency: transaction_fee_currency,
    }
}

pub fn execute_buy_transaction(transaction: &mut Transaction, account: &mut Account) -> Result<(), String> {
    let total_amount = transaction.price * transaction.quantity + transaction.transaction_fee;
    if account.account_balance >= total_amount {
        account.account_balance = account.account_balance.saturating_sub(total_amount);
        transaction.status = TransactionStatus::Completed;
        println!("Transaction completed successfully");
        //Display new balance
        println!("Your new balance is {}", account.account_balance);
        println!("Thanks for shopping at Trumall!");
        record_transaction(transaction);
        Ok(())
    } else {
        println!("Insufficient funds");
        Err("insufficient_funds".to_string())
    }
}

pub fn new_sell_transaction(
    user_id: Uuid,
    item_id: Uuid,
    item_price: u64,
    item_quantity: u64,
    currency: String,
    transaction_fees: u64,
    transaction_fees_currency: String,
    metadata: HashMap<String, serde_json::Value>,
) -> Transaction {
    Transaction {
        transaction_id: Uuid::new_v4(),
        user_id,
        transaction_type: TransactionType::Sell,
        metadata,
        amount: item_price * item_quantity,
        price: item_price,
        quantity: item_quantity,
        currency,
        status: TransactionStatus::Pending,
        item_id,
        timestamp: Utc::now(),
        transaction_fee: transaction_fees,
        transaction_fee_currency: transaction_fees_currency,
    }
}

pub fn record_transaction(transaction: &Transaction) {
    println!("Transaction recorded: {:?}", transaction);
}