use crate::models::{Account, CartItem, Item};
use crate::services;
use crate::utils::get_user_input;
use std::collections::HashMap;
use uuid::Uuid;

pub fn buy_flow(account: &mut Account, posted_items: &mut Vec<Item>) {
    let mut cart: HashMap<String, CartItem> = HashMap::new();
    // Search for items
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

        let selection = get_user_input("Enter the number of the item to add to your cart (or 'done' to finish):");

        if selection.to_lowercase() == "done" {
            break;
        }

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

    // Cart summary and checkout
    if !cart.is_empty() {
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

            match services::execute_buy_transaction(&mut transaction, account) {
                Ok(_) => println!("Checkout successful!"),
                Err(e) => println!("Checkout failed: {}", e),
            }
        }
    }
}

pub fn sell_flow(account: &mut Account, posted_items: &mut Vec<Item>) {
    let item_name = get_user_input("Enter the item name:");
    let item_price: u64 = get_user_input("Enter the item price:").parse().expect("Please enter a valid number");
    let item_description = get_user_input("Enter the item description:");

    let new_item = Item {
        id: (posted_items.len() + 1).to_string(),
        name: item_name,
        price: item_price,
        description: item_description,
    };

    posted_items.push(new_item.clone());

    let mut transaction = services::new_sell_transaction(
        Uuid::new_v4(), // user_id
        Uuid::new_v4(), // item_id
        item_price,
        1, // quantity
        "USD".to_string(),
        0, // transaction_fees
        "USD".to_string(),
        HashMap::new(),
    );

    match services::execute_sell_transaction(&mut transaction, account) {
        Ok(_) => println!("Sell transaction successful!"),
        Err(e) => println!("Sell transaction failed: {}", e),
    }

    println!("Item added for sale!");
}

