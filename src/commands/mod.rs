pub mod save_load;

#[tauri::command]
pub fn get_effects_state() -> Result<String, crate::rack::RackError> {
    let Some(rw_lock) = crate::rack::RACK.get() else {
        return Err(crate::rack::RackError::Uninitialized);
    };
    let Ok(guard) = rw_lock.lock() else {
        return Err(crate::rack::RackError::Poisoned);
    };
    Ok(serde_json::to_string(&*guard)?)
}

#[tauri::command]
pub fn toggle_playback() -> Result<(), crate::rack::RackError> {
    let Some(mutex) = crate::PLAY_TX.get() else {
        return Err(crate::rack::RackError::Uninitialized);
    };
    let Ok(guard) = mutex.lock() else {
        return Err(crate::rack::RackError::Poisoned);
    };
    guard.send(0).unwrap();
    Ok(())
}
