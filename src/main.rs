use bevy_app::prelude::*;
use bevy_ecs::prelude::*;

fn main() {
    #[cfg(debug_assertions)]
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();
    #[cfg(not(debug_assertions))]
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::WARN)
        .init();

    let mut app = App::new();
    app.set_runner(event_loop);

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
    loop {
        app.update();
        if let Some(exit) = app.should_exit() {
            return exit;
        }
    }
}
