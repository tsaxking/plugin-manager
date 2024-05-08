use plugin_manager::commands;

fn main() -> anyhow::Result<()> {
    plugin_manager::init_app_state(vec![]);
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::get_effects_state,
            commands::save_load::save,
            commands::save_load::load,
        ])
        .run(tauri::generate_context!())?;

    Ok(())
}
