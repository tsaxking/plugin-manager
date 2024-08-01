use std::process::Command;


fn main() {
    println!("cargo:rerun-if-changed=app");
    Command::new("npm").args(["run", "build"]).output().unwrap();
    tauri_build::build();
}
