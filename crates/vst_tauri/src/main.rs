use serde::{Deserialize, Serialize};
use std::io::prelude::*;
use std::net::TcpStream;
use std::sync::{Arc, Mutex, OnceLock};

static TCP: OnceLock<Mutex<TcpStream>> = OnceLock::new();

#[derive(Deserialize, Serialize)]
struct ControllerValue {
    event: String,
    payload: String,
}

#[tauri::command]
fn global_tauri(data: ControllerValue) {
    if let Ok(mut stream) = TCP.get().unwrap().lock() {
        let event = data.event;
        let payload = data.payload;
        let message = String::from(event + ":" + &payload);
        stream.write(message.as_bytes()).unwrap();
    }
}

#[tauri::command]
fn find_connections() -> Result<Vec<String>, String> {
    // Find all available connections with the port 8080
    // An available connection is a connection that responds correctly to a specific message

    let mut available_connections: Vec<String> = vec![];

    let mut ip_addresses: Vec<Arc<str>> = vec![];

    for i in 0..255 {
        for j in 0..255 {
            for k in 0..255 {
                for l in 0..255 {
                    let ip_address = format!("{}.{}.{}.{}", i, j, k, l);
                    ip_addresses.push(Arc::from(ip_address));
                }
            }
        }
    }

    for ip_address in ip_addresses {
        let mut stream = TcpStream::connect(ip_address.to_string()).unwrap();
        let message = String::from("ping");
        stream.write(message.as_bytes()).unwrap();
        let mut buffer = [0; 1024];
        stream.read(&mut buffer).unwrap();
        let response = String::from_utf8_lossy(&buffer[..]);
        if response == "pong" {
            available_connections.push(ip_address.to_string());
        }

        stream.shutdown(std::net::Shutdown::Both).unwrap();
    }

    return Ok(available_connections);
}

#[tauri::command]
fn connect_to_ip (data: String) -> Result<(), String> {
    let stream = TcpStream::connect(data).unwrap();
    TCP.set(Mutex::new(stream)).unwrap();
    return Ok(());
}

#[tauri::command]
fn is_connected() -> Result<bool, String> {
    Ok(TCP.get().is_some())
}

fn main() {
    println!("Hello, world!");
    // Tauri app
    tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(tauri::generate_handler![
            global_tauri,
            connect_to_ip,
            find_connections,
            is_connected,
        ])
        .run(tauri::generate_context!())
        .unwrap()
}
