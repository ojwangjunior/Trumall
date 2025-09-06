mod models;
mod services;
mod utils;
mod flows;

use crate::models::{Item};
use crate::utils::{generate_random_account_number, get_user_input};

fn main() {
    println!("Thanks for choosing Trustmall");
    println!("we are here to help you");

    let mut account = models::Account {
        account_name: get_user_input("Enter your name:"),
        account_number: generate_random_account_number(),
        account_balance: 10000, // Starting balance
        transaction_history: Vec::new(),
        account_pin: 0, // Will be set later
    };

    println!("Your account number is {}", account.account_number);

    account.account_pin = get_user_input("Create a 4-digit PIN:").parse().expect("Please enter a valid number");
    println!("Account created successfully!");

    let entered: u32 = get_user_input("Enter your PIN to log in:").parse().expect("Please enter a valid number");

    if account.account_pin == entered {
        println!("Access granted! Welcome, {}", account.account_name);
    } else {
        println!("Incorrect PIN.");
        return;
    }

    let mut posted_items: Vec<Item> = Vec::new();
    // Example item
    posted_items.push(Item { id: "1".to_string(), name: "Laptop".to_string(), price: 1200, description: "A powerful laptop".to_string() });

    loop {
        let choice = get_user_input("\nWhat would you like to do? (buy/sell/quit)");
        match choice.to_lowercase().as_str() {
            "buy" => {
                flows::buy_flow(&mut account, &mut posted_items);
            }
            "sell" => {
                flows::sell_flow(&mut account, &mut posted_items);
            }
            "quit" => {
                break;
            }
            _ => {
                println!("Invalid choice.");
            }
        }
    }
}