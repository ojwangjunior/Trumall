use std::io;
use std::collections::HashMap;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use rand::Rng;

fn main() {
    println!("Thanks for choosing Trustmall");
    println!("we are here to help you");

    struct Account {
        account_name: String,
        account_number: u32,
        account_balance: u64,
        transaction_history: Vec<String>,
        account_pin: u32,
    }

    //create an account for the user
    let mut account_name = String::new();
    println!("enter your name");
    std::io::stdin()
        .read_line(&mut account_name)
        .expect("failed to read input please enter a valid input");

    // generate random account number
    fn generate_random_account_number() -> u32 {
        let mut rng = rand::thread_rng();
        rng.gen_range(100000000..999999999)
    }

    let account_number = generate_random_account_number();
    println!("your account number is {}", account_number);

    //create account pin
    println!("Create a 4-digit PIN:");
    let mut pin = String::new();
    io::stdin()
        .read_line(&mut pin)
        .expect("Failed to read PIN");
    let pin: u32 = pin.trim().parse().expect("Please enter a valid number");
    println!("Account created successfully!");

    println!("Enter your PIN to log in:");
    let mut entered = String::new();
    io::stdin()
        .read_line(&mut entered)
        .expect("Failed to read PIN");
    let entered: u32 = entered.trim().parse().expect("Please enter a valid number");
    let mut cart: HashMap<String, CartItem> = HashMap::new();
    if pin == entered {
        println!("Access granted!");
    } else {
        println!("Incorrect PIN.");
    }

    #[derive(Debug, Clone, Serialize, Deserialize)]
    struct Item {
        id: String,
        name: String,
        price: u64,
        description: String,
    }

    #[derive(Clone)]
    struct CartItem {
        item: Item,
        quantity: u32,
    }

    //Search posted Items and add to cart
    let mut cart = HashMap::new();
    let item_id = String::new();
    let item_name = String::new();
    let item_price = String::new();
    let item_quantity = String::new();
    let item_description = String::new();
    let item_image = String::new();
    let item_category = String::new();
    let item_location = String::new();
    let item_date_posted = String::new();
    let item_posted_by = String::new();
    let mut item_string = String::new();

    let posted_items: Vec<Item> = Vec::new(); // Initialize empty vector for posted items

    loop {
        println!("Enter search keyword (or 'done' to finish):");
        item_string.clear();
        io::stdin().read_line(&mut item_string).unwrap();
        let keyword = item_string.trim().to_lowercase();

        if keyword == "done" {
            break;
        }

        // Search in posted_items
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

        println!("Enter the number of the item to add to your cart:");

        item_string.clear();
        io::stdin().read_line(&mut item_string).unwrap();
        let selection = item_string.trim();

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
    for cart_item in cart.values() {
        println!(
            "- {} x{} = ${}",
            cart_item.item.name,
            cart_item.quantity,
            cart_item.item.price * cart_item.quantity as u64
        );
    }

   //Remove items from cart
    loop {
        if cart.is_empty() {
            println!("Your cart is empty.");
            break;
        }

        println!("\nWould you like to remove any items from your cart? (yes/no):");
        let mut remove_choice = String::new();
        io::stdin().read_line(&mut remove_choice).unwrap();
        
        if remove_choice.trim().to_lowercase() != "yes" {
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

        println!("Enter the number of the item to remove:");
        let mut remove_input = String::new();
        io::stdin().read_line(&mut remove_input).unwrap();
        
        let remove_index: usize = match remove_input.trim().parse::<usize>() {
            Ok(n) if n > 0 && n <= cart_items.len() => n - 1,
            _ => {
                println!("Invalid selection");
                continue;
            }
        };

        let item_to_remove = &cart_items[remove_index];
        let item_id = item_to_remove.item.id.clone();
        let item_name = item_to_remove.item.name.clone();

        println!("Remove all {} or just reduce quantity? (all/reduce):", item_name);
        let mut action_choice = String::new();
        io::stdin().read_line(&mut action_choice).unwrap();

        match action_choice.trim().to_lowercase().as_str() {
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

    #[derive(Debug, Clone, Serialize, Deserialize)]
    enum TransactionType {
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

    impl Transaction {
        //create a new buy transaction
        pub fn new_buy_transaction(
            user_id: Uuid,
            item_id: Uuid,
            price: u64,
            quantity: u64,
            currency: String,
            transaction_fees: u64,
            transaction_fee_currency: String,
            metadata: HashMap<String, serde_json::Value>,
            timestamp: DateTime<Utc>,
            transaction_id: Uuid,
        ) -> Transaction {
            Transaction {
                transaction_id,
                user_id,
                transaction_type: TransactionType::Buy,
                metadata,
                amount: price * quantity,
                price,
                quantity,
                currency,
                status: TransactionStatus::Pending,
                item_id,
                timestamp,
                transaction_fee: transaction_fees,
                transaction_fee_currency,
            }
        }

        //Execute the buy transaction
        pub fn execute_buy_transaction(&mut self, account: &mut Account) -> Result<(), String> {
            let total_amount = self.price * self.quantity + self.transaction_fee;
            if account.account_balance >= total_amount {
                account.account_balance = account.account_balance.saturating_sub(total_amount);
                self.status = TransactionStatus::Completed;
                println!("Transaction completed successfully");
                //Display new balance
                println!("Your new balance is {}", account.account_balance);
                println!("Thanks for shopping at Trumall!");
                self.record_transaction();
                Ok(())
            } else {
                println!("Insufficient funds");
                Err("insufficient_funds".to_string())
            }
        }

        //Record transactions
        pub fn record_transaction(&self) {
            // Add transaction recording logic here
            println!("Transaction recorded: {:?}", self);
        }
    }

    //create a new sell transaction
    pub fn new_sell transaction(
        user_id: Uuid,
        item_id: Uuid,
        item_price: u64,
        item_quantity: u64,
        currency: String,
        transaction_fees: u64,
        transaction_fees_currency: String,
        metadata: Hashamap<String, serde_json::value>,
        timestamp: DateTime<Utc>,
    ) -> Transaction {
        Transaction {
            transaction_id: Uuid::new_v4(),
            user_id,
            transaction_tye: transaction_type::sell,
            metadata,
            amount: item_price * item_quantity,
            price: item_price,
            quantity:item_quantity,
            currency,
            status: transaction_status::pending,
            item_id,
            timestamp: Utc::now(),
            transaction_fees: transaction_fees,
            transaction_fee_currency::transaction_fees_currency,
        }
        
        }



        }
    }

    )

   