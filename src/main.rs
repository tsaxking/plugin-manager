use bevy_app::prelude::*;
use bevy_log::prelude::*;
use bevy_log::Level;
use bevy_log::LogPlugin;

fn main() {
    let mut app = App::new();
    app.set_runner(event_loop);

    app.add_plugins(LogPlugin {
        #[cfg(debug_assertions)]
        level: Level::DEBUG,
        #[cfg(debug_assertions)]
        filter: "info,pm=debug".into(),
        #[cfg(not(debug_assertions))]
        level: Level::ERROR,
        #[cfg(not(debug_assertions))]
        filter: "".to_string(),
        custom_layer: |_| None,
    });
    #[cfg(debug_assertions)]
    {
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
    }

    app.run();
}

fn event_loop(mut app: App) -> AppExit {
    info!("App Start");
    loop {
        app.update();
        if let Some(exit) = app.should_exit() {
            return exit;
        }
    }
}
