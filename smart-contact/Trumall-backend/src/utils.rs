use std::io;
use rand::Rng;

pub fn generate_random_account_number() -> u32 {
    let mut rng = rand::thread_rng();
    rng.gen_range(100000000..999999999)
}

pub fn get_user_input(prompt: &str) -> String {
    println!("{}", prompt);
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    input.trim().to_string()
}
