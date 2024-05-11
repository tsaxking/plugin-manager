use std::collections::HashMap;

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
