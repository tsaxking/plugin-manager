



fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("unable to run tauri application");
}
