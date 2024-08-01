use bevy::{
    log::{self, Level, LogPlugin},
    prelude::*,
};
use bevy_egui::{EguiPlugin, EguiSet};

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
    }))
    .add_plugins(EguiPlugin);

    app.add_systems(Update, hello_system);

    #[cfg(debug_assertions)]
    {
        use pm::debug::debug_ui;
        use pm::debug::set_stats;
        use pm::debug::DebugStats;
        use pm::debug::FrameRate;
        use pm::debug::LastFrameTime;

        app.add_systems(Update, (set_stats /*update_stats_display*/,));
        app.insert_resource::<DebugStats>(DebugStats::default())
            .insert_resource::<FrameRate>(FrameRate::new())
            .insert_resource::<LastFrameTime>(LastFrameTime {
                time: std::time::Instant::now(),
            });

        app.add_systems(PreUpdate, debug_ui.after(EguiSet::BeginFrame));
    }

    app.run();
}

fn hello_system() {
    // log::debug!("Hello, World!");
}
