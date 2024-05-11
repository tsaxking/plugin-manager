pub mod save_load;

#[tauri::command]
pub fn get_effects_state() -> Result<String, ruckus_rack::AppStateError> {
    let Some(rw_lock) = ruckus_rack::APP_STATE.get() else {
        return Err(ruckus_rack::AppStateError::Uninitialized);
    };
    let Ok(guard) = rw_lock.read() else {
        return Err(ruckus_rack::AppStateError::Poisoned);
    };
    Ok(serde_json::to_string(&*guard)?)
}

#[tauri::command]
pub fn toggle_playback() -> Result<(), ruckus_rack::AppStateError> {
    let Some(mutex) = ruckus_rack::PLAY_TX.get() else {
        return Err(ruckus_rack::AppStateError::Uninitialized);
    };
    let Ok(guard) = mutex.lock() else {
        return Err(ruckus_rack::AppStateError::Poisoned);
    };
    guard.send(0).unwrap();
    Ok(())
}
