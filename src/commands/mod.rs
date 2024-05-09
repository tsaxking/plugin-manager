pub mod save_load;

#[tauri::command]
pub fn get_effects_state() -> Result<String, crate::AppStateError> {
    let Some(rw_lock) = crate::APP_STATE.get() else {
        return Err(crate::AppStateError::Uninitialized);
    };
    let Ok(guard) = rw_lock.read() else {
        return Err(crate::AppStateError::Poisoned);
    };
    Ok(serde_json::to_string(&*guard)?)
}

#[tauri::command]
pub fn toggle_playback() -> Result<(), crate::AppStateError> {
    let Some(mutex) = crate::PLAY_TX.get() else {
        return Err(crate::AppStateError::Uninitialized);
    };
    let Ok(guard) = mutex.lock() else {
        return Err(crate::AppStateError::Poisoned);
    };
    guard.send(0).unwrap();
    Ok(())
}
