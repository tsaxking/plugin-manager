use serde::{Deserialize, Serialize};
use std::io::prelude::*;
use std::net::UdpSocket;
use std::sync::{Arc, Mutex, OnceLock};
use vst_tauri::utils::{self, Server};

static UDP: OnceLock<Mutex<Server>> = OnceLock::new();

#[derive(Deserialize, Serialize)]
struct ControllerValue {
    event: String,
    payload: String,
}

#[tauri::command]
fn global_tauri(data: ControllerValue) -> Result<String, String> {
    if let Ok(mut server) = UDP.get().unwrap().lock() {
        server.send(&data.event, &data.payload);
    }

    return Err("Not connected to a device".to_string());
}

#[tauri::command]
fn scan_devices() -> Result<Vec<String>, String> {
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

    }

    return Ok(available_connections);
}

#[tauri::command]
fn connect_to_device (data: String) -> Result<(), String> {
    let server = Server::new(&data);
    UDP.set(Mutex::new(server)).unwrap();

    // listen to all incoming messages
    tauri::async_runtime::spawn(async move {
        if let Ok(server) = UDP.get().unwrap().lock() {
            server.listen();
        }
    });

    return Ok(());
}

#[tauri::command]
fn is_connected() -> Result<bool, String> {
    Ok(UDP.get().is_some())
}

fn main() {
    println!("Hello, world!");
    tauri::async_runtime::spawn(utils::start_server());
    // Tauri app
    tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(tauri::generate_handler![
            global_tauri,
            connect_to_device,
            scan_devices,
            is_connected,
        ])
        .run(tauri::generate_context!())
        .unwrap()
}
