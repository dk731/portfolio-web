#[macro_use]
extern crate rocket;

use std::net::IpAddr;
use std::time::Instant;

use dashmap::DashMap;
use rocket::http::Status;
use rocket::request::{FromRequest, Outcome};
use rocket::serde::json::Json;
use serde::Deserialize;

use rocket::request::{self, Request};

use teloxide::prelude::*;
use teloxide::types::{ParseMode, Recipient};

use lazy_static::lazy_static;

#[derive(Deserialize)]
struct UserMessage {
    content: String,
    name: String,
    email: String,
}

// Special struct that will accept only 1 request/min
#[derive(Debug)]
pub struct RequestsLimit();

#[rocket::async_trait]
impl<'r> FromRequest<'r> for RequestsLimit {
    type Error = String;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        lazy_static! {
            static ref REQUEST_HISTORY: DashMap<IpAddr, Instant> = DashMap::new();
        }

        let Some(current_remote) = req.remote() else {
            return request::Outcome::Failure((Status::TooManyRequests, "Requests limit was reached, try again in a minute".to_string()));
        };
        let current_remote = current_remote.ip();

        println!("Current remote: {}", current_remote);

        if let Some(request_time) = REQUEST_HISTORY.get(&current_remote) {
            println!(
                "Request was found, dif: {}",
                request_time.elapsed().as_secs()
            );

            if request_time.elapsed().as_secs() < 60 {
                println!("REquests limit was hit!");
                return request::Outcome::Failure((
                    Status::TooManyRequests,
                    "Requests limit was reached, try again in a minute".to_string(),
                ));
            }
        };

        println!("Continue request");
        REQUEST_HISTORY.insert(current_remote, Instant::now());
        request::Outcome::Success(RequestsLimit {})
    }
}

static ESCAPE_CHARS: &'static [char] = &[
    '_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!',
];

fn escape_telegram(value: &str) -> String {
    let mut ret_val = String::from(value);

    ESCAPE_CHARS.into_iter().for_each(|char| {
        ret_val = ret_val.replace(&char.to_string(), &format!("\\{}", char));
    });

    ret_val
}

#[post("/send_message", format = "json", data = "<user_message>")]
async fn send_message(_limit: RequestsLimit, user_message: Json<UserMessage>) -> Status {
    let bot = Bot::from_env();

    let mut message_str = "".to_string();

    message_str.push_str(&format!(
        "Name: *{}*\n",
        escape_telegram(&user_message.name)
    ));
    message_str.push_str(&format!(
        "Email: *{}*\n\n",
        escape_telegram(&user_message.email)
    ));
    message_str.push_str(&format!(
        "Content: \n```{}```",
        escape_telegram(&user_message.content)
    ));

    match bot
        .parse_mode(ParseMode::MarkdownV2)
        .send_message(Recipient::Id(ChatId(1508908571)), message_str)
        .await
    {
        Ok(_) => Status::Ok,
        Err(_) => Status::InternalServerError,
    }
}

#[launch]
fn rocket() -> _ {
    println!("Rust API server started at http://localhost:3001");

    rocket::build()
        .configure(rocket::Config::figment().merge(("port", 3001)))
        .mount("/api", routes![send_message])
}
