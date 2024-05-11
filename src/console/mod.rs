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
        let mut v = string.split_whitespace();

        let cmd = v.next()?;
        let args: Vec<&str> = v.collect();

        let action = self.commands.get(cmd)?;
        Some(action(args))
    }
}


pub fn commands() -> Cli {
    let cli = Cli::new();

    cli.add(
        String::from("Test"),
        &|_: Vec<&str>| {
            String::from("Hi")
        }
    )
}