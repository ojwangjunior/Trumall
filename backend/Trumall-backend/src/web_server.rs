use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use crate::models::{Item, User, SignupData, LoginData, Claims};
use std::sync::Mutex;
use uuid::Uuid;
use bcrypt::{hash, verify, DEFAULT_COST};
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};

struct AppState {
    items: Mutex<Vec<Item>>,
    users: Mutex<Vec<User>>,
}

#[get("/products")]
async fn get_products(data: web::Data<AppState>) -> impl Responder {
    let items = data.items.lock().unwrap();
    HttpResponse::Ok().json(&*items)
}

#[get("/products/{id}")]
async fn get_product(data: web::Data<AppState>, id: web::Path<String>) -> impl Responder {
    let items = data.items.lock().unwrap();
    let item = items.iter().find(|item| item.id == *id);
    match item {
        Some(item) => HttpResponse::Ok().json(item),
        None => HttpResponse::NotFound().finish(),
    }
}

#[post("/signup")]
async fn signup(data: web::Data<AppState>, signup_data: web::Json<SignupData>) -> impl Responder {
    let mut users = data.users.lock().unwrap();
    if users.iter().any(|user| user.username == signup_data.username) {
        return HttpResponse::Conflict().body("Username already exists");
    }

    let password_hash = match hash(&signup_data.password, DEFAULT_COST) {
        Ok(h) => h,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    let new_user = User {
        id: Uuid::new_v4(),
        username: signup_data.username.clone(),
        password_hash,
    };

    users.push(new_user);

    HttpResponse::Created().finish()
}

#[post("/login")]
async fn login(data: web::Data<AppState>, login_data: web::Json<LoginData>) -> impl Responder {
    let users = data.users.lock().unwrap();
    let user = users.iter().find(|user| user.username == login_data.username);

    match user {
        Some(user) => {
            if verify(&login_data.password, &user.password_hash).unwrap_or(false) {
                let claims = Claims {
                    sub: user.id.to_string(),
                    exp: (chrono::Utc::now() + chrono::Duration::hours(24)).timestamp() as usize,
                };
                let token = encode(&Header::default(), &claims, &EncodingKey::from_secret("secret".as_ref())).unwrap();
                HttpResponse::Ok().json(serde_json::json!({ "token": token }))
            } else {
                HttpResponse::Unauthorized().body("Invalid credentials")
            }
        }
        None => HttpResponse::Unauthorized().body("Invalid credentials"),
    }
}

pub async fn start_server() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        items: Mutex::new(vec![
            Item {
                id: "1".to_string(),
                name: "Laptop".to_string(),
                price: 1200,
                description: "A powerful laptop".to_string(),
            },
            Item {
                id: "2".to_string(),
                name: "Keyboard".to_string(),
                price: 75,
                description: "A mechanical keyboard".to_string(),
            },
            Item {
                id: "3".to_string(),
                name: "Mouse".to_string(),
                price: 25,
                description: "Wireless mouse".to_string(),
            },
        ]),
        users: Mutex::new(Vec::new()),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .service(get_products)
            .service(get_product)
            .service(signup)
            .service(login)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
