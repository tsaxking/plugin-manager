#![warn(clippy::all)]
#![warn(clippy::cargo)]
#![warn(unsafe_code)]
#![allow(clippy::needless_return, clippy::multiple_crate_versions)]

pub mod commands;
mod tests;

#[derive(Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct RackItem {
    id: String,
    note: String,
    point: [f64; 2],
    width: f64,
    color: String,
    title: String,
    io: Io,
    routing: Routing,
}

#[derive(Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Io {
    audio: Vec<Vec<String>>,
    midi: Vec<Vec<String>>,
    control: Vec<Vec<String>>,
}

#[derive(Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Routing {
    audio: Vec<Vec<String>>,
    midi: Vec<Vec<String>>,
    control: Vec<Vec<String>>,
}
