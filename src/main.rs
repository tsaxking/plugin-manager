use bevy::{log::{self, Level, LogPlugin}, prelude::*};

fn main() {
    let mut app = App::new();
    app.add_plugins(DefaultPlugins.set(LogPlugin {
        #[cfg(debug_assertions)]
        level: Level::DEBUG,
        #[cfg(debug_assertions)]
        filter: "info,wgpu=warn,wgpu_core=warn,wgpu_hal=warn,pm=debug".into(),
        #[cfg(not(debug_assertions))]
        level: Level::ERROR,
        #[cfg(not(debug_assertions))]
        filter: "".to_string(),
        update_subscriber: None,
    }));

    app.add_systems(Update, hello_system);

    app.run();
}

fn hello_system() {
    log::debug!("Hello, World!");
}
