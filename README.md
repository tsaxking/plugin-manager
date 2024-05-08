# Plugin Manager

![Front End](https://github.com/github/docs/actions/workflows/ts.yml/badge.svg)

![Back End](https://github.com/github/docs/actions/workflows/rust.yml/badge.svg)

## Dependencies

-   [Rustup](https://rustup.rs/)
-   Tauri Cli `cargo install tauri-cli`

## Developing

With local development server

```bash
cargo tauri dev
```

Without local development server

```bash
cargo run
```

## Building for Release

```bash
cargo tauri build
```
