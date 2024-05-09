use crate::AppState;
use std::{fs, path};

#[derive(thiserror::Error, serde::Serialize, Debug)]
pub enum SaveError {
    #[error(transparent)]
    AppStateError(#[from] crate::AppStateError),

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
    AppStateError(#[from] crate::AppStateError),

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
    let Some(rw_lock) = crate::APP_STATE.get() else {
        return Err(SaveError::AppStateError(
            crate::AppStateError::Uninitialized,
        ));
    };

    let Ok(guard) = rw_lock.read() else {
        return Err(SaveError::AppStateError(crate::AppStateError::Poisoned));
    };
    let json = serde_json::to_string(&guard.to_vec())?;
    fs::write(file_path, json)?;
    Ok(())
}

#[tauri::command]
pub fn load(filename: String) -> Result<(), LoadError> {
    let file_path = path::Path::new(&filename);
    let json = fs::read_to_string(file_path)?;
    let state: AppState = serde_json::from_str(&json)?;
    let Some(rw_lock) = crate::APP_STATE.get() else {
        return Err(LoadError::AppStateError(
            crate::AppStateError::Uninitialized,
        ));
    };
    let Ok(mut guard) = rw_lock.write() else {
        return Err(LoadError::AppStateError(crate::AppStateError::Poisoned));
    };
    *guard = state;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_save() {
        crate::init_app_state(crate::dev::test_state_schema::get());
        let base_dir = std::env::temp_dir();
        let filename = "./save_file.json";
        let full_path = base_dir.join(filename).to_str().unwrap().to_string();
        save(full_path).unwrap();
    }

    #[test]
    fn test_load() {
        crate::init_app_state(crate::dev::test_state_schema::get());
        let base_dir = std::env::temp_dir();
        let filename = "./save_file.json";
        let full_path = base_dir.join(filename).to_str().unwrap().to_string();
        save(full_path.clone()).unwrap();
        eprintln!("{:?}", std::fs::read_to_string(&full_path));
        load(full_path).unwrap();
    }
}
