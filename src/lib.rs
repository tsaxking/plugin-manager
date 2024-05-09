#![warn(clippy::all)]
#![warn(clippy::cargo)]
#![warn(unsafe_code)]
#![allow(clippy::needless_return, clippy::multiple_crate_versions)]

#[cfg(test)]
mod dev;

pub mod commands;

use std::sync;

pub static APP_STATE: sync::OnceLock<sync::RwLock<AppState>> = sync::OnceLock::new();
pub static PLAY_TX: sync::OnceLock<sync::Mutex<sync::mpsc::Sender<usize>>> = sync::OnceLock::new();

#[derive(thiserror::Error, serde::Serialize, Debug)]
pub enum AppStateError {
    #[error("APP_STATE was not properly initialized at program start")]
    Uninitialized,

    #[error("APP_STATE RwLock was poisoned. Did a thread panic?")]
    Poisoned,

    #[error("APP_STATE could not be serialized into JSON")]
    SerializeError {
        #[from]
        #[serde(skip)]
        source: serde_json::Error,
    },
}

type AppState = Vec<RackItem>;

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct RackItem {
    id: String,
    note: String,
    point: (u8, u8),
    width: u8,
    color: String,
    title: String,
    io: Io,
    routing: Routing,
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Io {
    audio: IoInner,
    midi: IoInner,
    control: IoInner,
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct IoInner {
    input: Vec<String>,
    output: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Routing {
    audio: Vec<String>,
    midi: Vec<String>,
    control: Vec<String>,
}

mod tests {

    #[cfg(test)]
    #[derive(Debug)]
    struct IgnoreWhitespace<'a> {
        string: &'a str,
    }

    #[cfg(test)]
    impl<'a> PartialEq for IgnoreWhitespace<'a> {
        fn eq(&self, other: &Self) -> bool {
            let mut self_iter = self.string.chars();
            let mut other_iter = other.string.chars();

            while let (Some(mut self_c), Some(mut other_c)) =
                (self_iter.next(), other_iter.next())
            {
                while self_c.is_whitespace() {
                    let opt_c = self_iter.next();
                    if opt_c.is_some() {
                        self_c = opt_c.unwrap();
                    }
                }

                while other_c.is_whitespace() {
                    let opt_c = other_iter.next();
                    if opt_c.is_some() {
                        other_c = opt_c.unwrap();
                    }
                }

                if self_c != other_c {
                    return false;
                }
            }

            true
        }
    }

    #[test]
    fn serialize_app_state() {
        let schema = crate::dev::test_state_schema::get();
        let actual = serde_json::to_string(&schema).unwrap().to_string();
        let expected = std::fs::read_to_string("./src/dev/serialized.json").unwrap();

        let left = IgnoreWhitespace { string: &actual };
        let right = IgnoreWhitespace { string: &expected };
        assert_eq!(left, right);
    }

    #[test]
    fn deserialize_app_state() {
        use crate::AppState;
        let json = std::fs::read_to_string("./src/dev/serialized.json").unwrap();
        let actual: AppState = serde_json::from_str(&json).unwrap();
        let expected = crate::dev::test_state_schema::get();
        assert_eq!(actual, expected);
    }
}

pub fn init_app_state(state: AppState) {
    APP_STATE
        .set(sync::RwLock::new(state))
        .expect("Critical Error: Could not set APP_STATE");
}

pub fn init_play_tx(tx: sync::mpsc::Sender<usize>) {
    PLAY_TX
        .set(sync::Mutex::new(tx))
        .expect("Critical Error: Could not set PLAY_TX");
}
