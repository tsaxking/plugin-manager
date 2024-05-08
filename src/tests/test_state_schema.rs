use crate::*;

pub fn get() -> Vec<RackItem<'static>> {
    vec![RackItem {
        id: "KJexCx5B0UzH4ovi",
        note: "Keystation 88 Pro",
        point: [0.0, 0.0],
        width: 8.0,
        color: "light",
        title: "MIDI Controller",
        io: Io {
            audio: [&[], &[]],
            midi: [&["MIDI In"], &["MIDI Out"]],
            control: [&[], &[]],
        },
        routing: Routing {
            audio: &[],
            midi: &[],
            control: &[],
        },
    }]
}
