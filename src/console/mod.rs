use std::{iter::Peekable, slice::Iter};

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Token<'a> {
    GreetToken,
    TogglePlayback,
    Save,
    Load,
    Help,
    EOL,
    String(&'a str),
}

#[derive(Debug)]
pub enum AstNode {
    Greet,
    TogglePlayback,
    Save { path: String },
    Load { path: String },
    Help,
    NoOp,
    SyntaxError(String),
}

impl<'a> From<&'a str> for Token<'a> {
    fn from(value: &'a str) -> Self {
        match value {
            "greet" => Token::GreetToken,
            "toggle_playback" => Token::TogglePlayback,
            "save" => Token::Save,
            "load" => Token::Load,
            "help" => Token::Help,
            "\n" => Token::EOL,
            _ => Token::String(value),
        }
    }
}

fn lex(input: &str) -> Vec<Token> {
    input
        .split(|c: char| c == ' ' || c == ';' || c == '\n')
        .filter(|s| !s.is_empty())
        .map(|s| s.into())
        .collect::<Vec<Token>>()
}

fn assert_peek<'a>(
    input: &'a mut Peekable<Iter<'a, Token<'a>>>,
    expected: Token,
) -> Option<Token<'a>> {
    if let Some(actual) = input.peek() {
        if **actual == expected {
            input.next();
            return None;
        } else {
            return Some(**actual);
        }
    } else if expected == Token::EOL {
        return None;
    } else {
        return Some(Token::EOL);
    }
}

fn parse(input: Vec<Token>) -> AstNode {
    let mut tokens = input.iter().peekable();
    let tok = tokens.peek();
    if tok.is_none() {
        return AstNode::NoOp;
    }
    match tok.unwrap() {
        Token::GreetToken => parse_no_subcommands(&mut tokens, AstNode::Greet),
        Token::TogglePlayback => {
            parse_no_subcommands(&mut tokens, AstNode::TogglePlayback)
        }
        Token::Help => parse_no_subcommands(&mut tokens, AstNode::Help),
        Token::Save => parse_save_load(&mut tokens),
        Token::Load => parse_save_load(&mut tokens),
        t => AstNode::SyntaxError(format!("Unexpected {:?}", t)),
    }
}

fn parse_save_load<'a>(input: &'a mut Peekable<Iter<'a, Token<'a>>>) -> AstNode {
    let save_load_tok = input.next().unwrap();
    let next = input.next();
    if next.is_none() {
        return AstNode::SyntaxError(
            "Expected `<cmd> <path: String>`, found \"\"".to_string(),
        );
    }
    let next = next.unwrap();
    if let Token::String(s) = next {
        match save_load_tok {
            Token::Save => AstNode::Save {
                path: s.to_string(),
            },
            Token::Load => AstNode::Load {
                path: s.to_string(),
            },
            _ => unreachable!(),
        }
    } else {
        AstNode::SyntaxError("Expected `<cmd> <path: String>`, found \"\"".to_string())
    }
}

fn parse_no_subcommands<'a>(
    input: &'a mut Peekable<Iter<'a, Token<'a>>>,
    expected_node: AstNode,
) -> AstNode {
    // should have the greet token and then nothing else
    let _greet_tok = input.next().unwrap();
    let next = assert_peek(input, Token::EOL);
    if next.is_some() {
        return AstNode::SyntaxError(format!("Expected (), found {:?}", next));
    }
    expected_node
}

fn evaluate(input: AstNode) -> String {
    match input {
        AstNode::Greet => "Hello, World!".to_string(),
        AstNode::TogglePlayback => {
            crate::commands::toggle_playback().unwrap();
            "Playback toggled".to_string()
        }
        AstNode::Help => {
            let mut output = String::new();
            output.push_str("\nAvailable commands: \n");
            for cmd in ["help", "greet", "toggle_playback", "save <filename", "load <filename>"] {
                let text = format!(":: {}\n", cmd);
                output.push_str(&text);
            }
            output
        }
        AstNode::Save { path } => {
            crate::commands::save_load::save(path.clone()).unwrap();
            format!("Saving APP_STATE to {}", path)
        }
        AstNode::Load { path } => {
            crate::commands::save_load::load(path.clone()).unwrap();
            format!("Loading APP_STATE from {}", path)
        }
        AstNode::NoOp => String::new(),
        AstNode::SyntaxError(e) => e,
    }
}

pub fn read_command(input: &str) -> String {
    let tokens = lex(input);
    let ast = parse(tokens);
    evaluate(ast)
}
