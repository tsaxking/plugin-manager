#![warn(clippy::all)]
#![warn(unsafe_code)]
#![allow(clippy::needless_return, clippy::multiple_crate_versions)]

pub mod commands;
#[cfg(debug_assertions)]
pub mod console;
pub mod rack {
    pub use pm_rack::*;
}

use std::sync;

pub static PLAY_TX: sync::OnceLock<sync::Mutex<sync::mpsc::Sender<usize>>> =
    sync::OnceLock::new();

pub fn init_play_tx(tx: sync::mpsc::Sender<usize>) {
    PLAY_TX
        .set(sync::Mutex::new(tx))
        .expect("Critical Error: Could not set PLAY_TX");
}
