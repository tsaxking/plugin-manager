fn main() {
    println!("cargo:rerun-if-changed=app/dist");
    tauri_build::build();
}
