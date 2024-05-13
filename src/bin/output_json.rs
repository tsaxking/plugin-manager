use pm::rack::RackItem;
use pm::rack::RACK;
use std::ops::Deref;

fn main() {
    pm::rack::init_rack(pm::rack::Rack::default());
    let mut guard = RACK.get().unwrap().lock().unwrap();
    for _ in 0..2 {
        let example_ri = pm::rack::ExampleRackItem::default();
        guard
            .items
            .insert(example_ri.metadata().id.clone(), Box::new(example_ri));
    }
    let json = serde_json::to_string_pretty(&guard.deref()).unwrap();
    println!("{json}");
}
