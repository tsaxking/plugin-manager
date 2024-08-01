use serde::{Deserialize, Serialize};
use crate::TAURI_TX;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum TauriEvent {
    MyEvent{data: String},
    Play{channel: usize}
}

#[tauri::command]
pub fn global(data: TauriEvent) -> Result<String, String> {
    TAURI_TX.get().unwrap().lock().unwrap().send(data).unwrap();
    Err("Fuck you, bear".to_string())
}