use plugin_manager::commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::get_effects_state])
        .run(tauri::generate_context!())
        .expect("unable to run tauri application");
}
