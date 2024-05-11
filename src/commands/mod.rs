pub mod save_load;

#[tauri::command]
pub fn get_effects_state() -> Result<String, pm_rack::AppStateError> {
    let Some(rw_lock) = pm_rack::APP_STATE.get() else {
        return Err(pm_rack::AppStateError::Uninitialized);
    };
    let Ok(guard) = rw_lock.read() else {
        return Err(pm_rack::AppStateError::Poisoned);
    };
    Ok(serde_json::to_string(&*guard)?)
}

#[tauri::command]
pub fn toggle_playback() -> Result<(), pm_rack::AppStateError> {
    let Some(mutex) = pm_rack::PLAY_TX.get() else {
        return Err(pm_rack::AppStateError::Uninitialized);
    };
    let Ok(guard) = mutex.lock() else {
        return Err(pm_rack::AppStateError::Poisoned);
    };
    guard.send(0).unwrap();
    Ok(())
}
