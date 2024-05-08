#![warn(clippy::all)]
#![warn(clippy::cargo)]
#![warn(unsafe_code)]
#![allow(clippy::needless_return, clippy::multiple_crate_versions)]

pub mod commands;
mod tests;

#[derive(Debug, PartialEq, serde::Serialize)]
pub struct RackItem<'a> {
    id: &'a str,
    note: &'a str,
    point: [f64; 2],
    width: f64,
    color: &'a str,
    title: &'a str,
    io: Io<'a>,
    routing: Routing<'a>,
}

#[derive(Debug, PartialEq, serde::Serialize)]
pub struct Io<'a> {
    audio: [&'a [&'a str]; 2],
    midi: [&'a [&'a str]; 2],
    control: [&'a [&'a str]; 2],
}

#[derive(Debug, PartialEq, serde::Serialize)]
pub struct Routing<'a> {
    audio: &'a [&'a str],
    midi: &'a [&'a str],
    control: &'a [&'a str],
}

