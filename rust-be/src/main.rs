#[macro_use]
extern crate juniper;
extern crate r2d2;
extern crate r2d2_mysql;
extern crate serde_json;

use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer};

use crate::db::get_db_pool;
use crate::handlers::register;

mod db;
mod handlers;
mod schemas;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    std::env::set_var("RUST_LOG", "actix_web=info,info");
    env_logger::init();
    let pool = get_db_pool();

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .wrap(middleware::Logger::default())
            .wrap(
                Cors::new()
                .allowed_methods(vec!["POST", "GET"])
                .max_age(3600)
                .finish(),
            )
            .configure(register)
            .default_service(web::to(|| async { "404" }))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}