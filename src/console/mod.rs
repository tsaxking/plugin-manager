use std::collections::HashMap;
use regex::Regex;

type F = &'static dyn Fn(Vec<&str>) -> String;


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

    pub fn run(&self, string: &String) -> Option<String> {
        let r = Regex::new(r#"\s+(?=([^"]*"[^"]*")*[^"]*$)"#).expect("Invalid Regex");
        let v: Vec<&str> = string.split(r);

        let cmd: &str = v.next()?;
        let args: Vec<&str> = v.collect();

        let action = self.commands.get(cmd)?;
        Some(action(args))
    }
}


pub fn commands() -> Cli {
    let cli = Cli::new();

    cli.add(
        String::from("ping"),
        &|_: Vec<&str>| {
            String::from("pong")
        }
    )
    .add(
        String::from("echo"),
        &|args: Vec<&str>| {
            args.join(" ")
        }
    )
}