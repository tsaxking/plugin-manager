#![warn(clippy::all)]
#![warn(unsafe_code)]
#![allow(clippy::needless_return, clippy::multiple_crate_versions)]
use commands::TauriEvent;

pub mod commands;
#[cfg(debug_assertions)]
pub mod console;
pub mod rack {
    pub use pm_rack::*;
}

use std::sync;



pub static TAURI_TX: sync::OnceLock<sync::Mutex<sync::mpsc::Sender<TauriEvent>>> =
    sync::OnceLock::new();

pub fn init_tauri_tx(tx: sync::mpsc::Sender<TauriEvent>) {
    TAURI_TX
        .set(sync::Mutex::new(tx))
        .expect("Critical Error: Could not set PLAY_TX");
}

pub fn test_json() -> String {
    use crate::rack::RackItem;
    use crate::rack::RACK;
    use std::ops::Deref;
    crate::rack::init_rack(crate::rack::Rack::default());
    let mut guard = RACK.get().unwrap().lock().unwrap();
    for _ in 0..2 {
        let example_ri = crate::rack::ExampleRackItem::default();
        guard
            .items
            .insert(example_ri.metadata().id.clone(), Box::new(example_ri));
    }
    let json = serde_json::to_string_pretty(&guard.deref()).unwrap();
    return json;
}
