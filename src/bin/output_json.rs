fn main() {
    let json = pm::test_json();
    std::fs::write("crates/pm_rack/serialized.json", &json).unwrap();
    println!("{}", json);
}
