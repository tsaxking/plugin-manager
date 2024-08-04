use serde::{Deserialize, Serialize};
use std::io::prelude::*;
use std::net::TcpStream;

#[derive(Deserialize, Serialize)]
struct ControllerValue {
    event: String,
    payload: String,
}

#[tauri::command]
pub fn global(data: ControllerValue) {
}


pub fn register_commands() {
    tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(tauri::generate_handler![
        ])
        .run(tauri::generate_context!())
        .unwrap()
}

pub fn initilaize_tcp_connection() {
    let mut stream = TcpStream::connect("192.168.0.1:8080").unwrap();
}