use bevy_ecs::prelude::*;
use pm::commands;
// use std::io::Write;
// use std::sync::mpsc;
// use std::thread;

#[derive(SystemSet, Debug, Clone, PartialEq, Eq, Hash)]
pub struct FlushEvents;

fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::WARN)
        .init();

    pm::rack::init_rack(pm::rack::Rack::default());


    // let thread_handles = [
    //     // // CLI thread
    //     // #[cfg(debug_assertions)]
    //     // thread::spawn(move || {
    //     //     use pm::console;
    //     //     let mut stdout = std::io::stdout();
    //     //     let cli = console::commands();
    //     //     loop {
    //     //         let mut buf: String = Default::default();
    //     //         write!(stdout, "❯ ").unwrap();
    //     //         stdout.flush().unwrap();
    //     //         std::io::stdin().read_line(&mut buf).unwrap();
    //     //         let response = cli
    //     //             .run(&buf)
    //     //             .unwrap_or(String::from("Did not receive valid command"));
    //     //         writeln!(stdout, "{}", response).unwrap();
    //     //     }
    //     // }),
    // ];

    // add the tauri events
    commands::register_commands();

    // for handle in thread_handles.into_iter() {
    //     handle.join().unwrap();
    // }

    Ok(())
}

