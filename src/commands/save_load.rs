// use pm_rack::AppState;
use std::{fs, path};

#[derive(thiserror::Error, serde::Serialize, Debug)]
pub enum SaveError {
    #[error(transparent)]
    RackError(#[from] crate::rack::RackError),

    #[error("The system could not find the path specified")]
    DirectoryDoesNotExist {
        #[from]
        #[serde(skip)]
        source: std::io::Error,
    },

    #[error("APP_STATE could not be serialized into JSON")]
    SerializeError {
        #[from]
        #[serde(skip)]
        source: serde_json::Error,
    },
}

#[derive(thiserror::Error, serde::Serialize, Debug)]
pub enum LoadError {
    #[error(transparent)]
    RackError(#[from] crate::rack::RackError),

    #[error("The system could not find the path specified")]
    DirectoryDoesNotExist {
        #[from]
        #[serde(skip)]
        source: std::io::Error,
    },

    #[error("APP_STATE could not be derialized from JSON")]
    SerializeError {
        #[from]
        #[serde(skip)]
        source: serde_json::Error,
    },
}

#[tauri::command]
pub fn save(filename: String) -> Result<(), SaveError> {
    let file_path = path::Path::new(&filename);
    let Some(rw_lock) = crate::rack::RACK.get() else {
        return Err(SaveError::RackError(crate::rack::RackError::Uninitialized));
    };

    let Ok(guard) = rw_lock.lock() else {
        return Err(SaveError::RackError(crate::rack::RackError::Poisoned));
    };
    let json = serde_json::to_string(&*guard)?;
    fs::write(file_path, json)?;
    Ok(())
}

#[tauri::command]
pub fn load(filename: String) -> Result<(), LoadError> {
    let file_path = path::Path::new(&filename);
    let json = fs::read_to_string(file_path)?;
    let state: crate::rack::Rack = serde_json::from_str(&json)?;
    let Some(mutex) = crate::rack::RACK.get() else {
        return Err(LoadError::RackError(crate::rack::RackError::Uninitialized));
    };
    let Ok(mut guard) = mutex.lock() else {
        return Err(LoadError::RackError(crate::rack::RackError::Poisoned));
    };
    *guard = state;

    Ok(())
}
