#[tauri::command]
pub fn get_effects_state() -> String {
    serde_json::to_string(&crate::tests::test_state_schema::get()).unwrap()
}
