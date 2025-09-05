mod models;
mod services;
mod utils;

use std::collections::HashMap;
use uuid::Uuid;
use crate::models::{CartItem, Item};
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

    let mut cart: HashMap<String, CartItem> = HashMap::new();
    if account.account_pin == entered {
        println!("Access granted! Welcome, {}", account.account_name);
        println!("Access granted!");
    } else {
        println!("Incorrect PIN.");
        return;
    }

    let mut posted_items: Vec<Item> = Vec::new();
    // Example item
    posted_items.push(Item { id: "1".to_string(), name: "Laptop".to_string(), price: 1200, description: "A powerful laptop".to_string() });


    loop {
        let keyword = get_user_input("Enter search keyword (or 'done' to finish):");

        if keyword.to_lowercase() == "done" {
            break;
        }

        let results: Vec<&Item> = posted_items
            .iter()
            .filter(|item| {
                item.name.to_lowercase().contains(&keyword)
                    || item.description.to_lowercase().contains(&keyword)
            })
            .collect();

        if results.is_empty() {
            println!("No items found for '{}'", keyword);
            continue;
        }

        println!("Search results:");
        for (index, item) in results.iter().enumerate() {
            println!(
                "{}. {} - ${} | {}",
                index + 1,
                item.name,
                item.price,
                item.description
            );
        }

        let selection = get_user_input("Enter the number of the item to add to your cart:");

        let selected_index: usize = match selection.parse::<usize>() {
            Ok(n) if n > 0 && n <= results.len() => n - 1,
            _ => {
                println!("Invalid selection");
                continue;
            }
        };

        let selected_item = results[selected_index].clone();

        cart.entry(selected_item.id.clone())
            .and_modify(|cart_item: &mut CartItem| cart_item.quantity += 1)
            .or_insert(CartItem {
                item: selected_item.clone(),
                quantity: 1,
            });

        println!(
            "Added '{}' to cart. Quantity now: {}",
            selected_item.name,
            cart[&selected_item.id].quantity
        );
    }

    println!("\nYour Cart Summary:");
    let mut total_price = 0;
    for cart_item in cart.values() {
        let item_total = cart_item.item.price * cart_item.quantity as u64;
        println!(
            "- {} x{} = ${}",
            cart_item.item.name,
            cart_item.quantity,
            item_total
        );
        total_price += item_total;
    }
    println!("Total: ${}", total_price);

    let checkout_choice = get_user_input("\nProceed to checkout? (yes/no):");

    if checkout_choice.to_lowercase() == "yes" {
        let mut transaction = services::new_buy_transaction(
            Uuid::new_v4(), // user_id
            Uuid::new_v4(), // item_id
            total_price, // price
            1, // quantity
            "USD".to_string(),
            0, // transaction_fees
            "USD".to_string(),
            HashMap::new(),
        );

        match services::execute_buy_transaction(&mut transaction, &mut account) {
            Ok(_) => println!("Checkout successful!"),
            Err(e) => println!("Checkout failed: {}", e),
        }
    }

    loop {
        if cart.is_empty() {
            println!("Your cart is empty.");
            break;
        }

        let remove_choice = get_user_input("\nWould you like to remove any items from your cart? (yes/no):");

        if remove_choice.to_lowercase() != "yes" {
            break;
        }

        println!("\nCurrent items in your cart:");
        let cart_items: Vec<_> = cart.values().collect();
        for (index, cart_item) in cart_items.iter().enumerate() {
            println!(
                "{}. {} - Quantity: {} - Total: ${}",
                index + 1,
                cart_item.item.name,
                cart_item.quantity,
                cart_item.item.price * cart_item.quantity as u64
            );
        }

        let remove_input = get_user_input("Enter the number of the item to remove:");

        let remove_index: usize = match remove_input.parse::<usize>() {
            Ok(n) if n > 0 && n <= cart_items.len() => n - 1,
            _ => {
                println!("Invalid selection");
                continue;
            }
        };

        let item_to_remove = &cart_items[remove_index];
        let item_id = item_to_remove.item.id.clone();
        let item_name = item_to_remove.item.name.clone();

        let action_choice = get_user_input(&format!("Remove all {} or just reduce quantity? (all/reduce):", item_name));

        match action_choice.to_lowercase().as_str() {
            "all" => {
                cart.remove(&item_id);
                println!("Removed all '{}' from cart", item_name);
            }
            "reduce" => {
                if let Some(cart_item) = cart.get_mut(&item_id) {
                    if cart_item.quantity > 1 {
                        cart_item.quantity -= 1;
                        println!("Reduced '{}' quantity to {}", item_name, cart_item.quantity);
                    } else {
                        cart.remove(&item_id);
                        println!("Removed last '{}' from cart", item_name);
                    }
                }
            }
            _ => {
                println!("Invalid choice. No changes made.");
            }
        }
    }
}