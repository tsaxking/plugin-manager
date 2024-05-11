use crate::*;

pub fn get() -> Vec<RackItem> {
    vec![RackItem {
        id: "KJexCx5B0UzH4ovi".to_string(),
        note: "Keystation 88 Pro".to_string(),
        point: (0, 0),
        width: 8,
        color: "light".to_string(),
        title: "MIDI Controller".to_string(),
        io: Io {
            audio: IoInner {
                input: vec![],
                output: vec![],
            },
            midi: IoInner {
                input: vec!["MIDI In".to_string()],
                output: vec!["MIDI Out".to_string()],
            },
            control: IoInner {
                input: vec![],
                output: vec![],
            },
        },
        routing: Routing {
            audio: vec![],
            midi: vec![],
            control: vec![],
        },
    }]
}
