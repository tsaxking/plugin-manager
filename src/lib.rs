#![warn(clippy::all)]
#![warn(unsafe_code)]
#![allow(clippy::needless_return, clippy::multiple_crate_versions)]

#[cfg(debug_assertions)]
pub mod console;

pub mod commands;

pub mod rack {
    pub use ruckus_rack::*;
}
