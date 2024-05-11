use std::collections::HashMap;

type F = &'static dyn Fn(Vec<&str>) -> String;
#[derive(Default)]
pub struct Cli {
    commands: HashMap<String, F>,
}

impl Cli {
    pub fn new() -> Self {
        Cli {
            commands: HashMap::new(),
        }
    }

    pub fn add(mut self, name: String, f: F) -> Self {
        self.commands.insert(name, f);
        self
    }

    pub fn run(&self, string: &str) -> Option<String> {
        // let regex = Regex::new(r#"\s+(?=([^"]*"[^"]*")*[^"]*$)"#).expect("Invalid Regex");
        // let mut split = regex.split(string);
        let mut split = string.split_whitespace();

        let cmd: &str = split.next()?;
        let args: Vec<&str> = split.collect();

        let action = self.commands.get(cmd)?;
        Some(action(args))
    }
}

pub fn commands() -> Cli {
    let cli = Cli::new();

    cli.add(String::from("ping"), &|_| String::from("pong"))
        .add(String::from("echo"), &|args: Vec<&str>| args.join(" "))
        .add(String::from("help"), &|_| {
            let mut output = String::new();
            output.push_str("\nAvailable commands: \n");
            for cmd in [
                "help",
                "greet",
                "toggle_playback",
                "save <filename",
                "load <filename>",
            ] {
                let text = format!(":: {}\n", cmd);
                output.push_str(&text);
            }
            output
        })
        .add(String::from("greet"), &|_| String::from("Hello World"))
        .add(String::from("save"), &|args| {
            let path = args.join(" ");
            crate::commands::save_load::save(path.clone()).unwrap();
            format!("Saving APP_STATE to {}", path)
        })
        .add(String::from("load"), &|args| {
            let path = args.join(" ");
            crate::commands::save_load::load(path.clone()).unwrap();
            format!("Loading APP_STATE from {}", path)
        })
        .add(String::from("toggle_play"), &|_| {
            crate::commands::toggle_playback().unwrap();
            "Playback toggled".to_string()
        })
        .add(String::from(""), &|_| String::new())
}
