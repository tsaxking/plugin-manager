use crate::*;

pub fn get() -> Vec<RackItem> {
    vec![
        RackItem {
            id: "KJexCx5B0UzH4ovi".to_string(),
            note: "Keystation 88 Pro".to_string(),
            point: [0.0, 0.0],
            width: 8.0,
            color: "light".to_string(),
            title: "MIDI Controller".to_string(),
            io: Io {
                audio: vec![vec![], vec![]],
                midi: vec![vec!["MIDI In".to_string()], vec!["MIDI Out".to_string()]],
                control: vec![vec![], vec![]],
            },
            routing: Routing {
                audio: vec![],
                midi: vec![vec!["PIEkNfXWN5H1bAxi:0".to_string()]],
                control: vec![],
            },
        },
        RackItem {
            id: "PIEkNfXWN5H1bAxi".to_string(),
            note: "ASDR".to_string(),
            point: [9.0, 1.0],
            width: 8.0,
            color: "danger".to_string(),
            title: "MIDI Controller".to_string(),
            io: Io {
                audio: vec![vec![], vec![]],
                midi: vec![vec!["MIDI In".to_string()], vec![]],
                control: vec![
                    vec![],
                    vec![
                        "Volume".to_string(),
                        "Pitch".to_string(),
                        "Modulation".to_string(),
                    ],
                ],
            },
            routing: Routing {
                audio: vec![],
                midi: vec![],
                control: vec![
                    vec!["IwyQtdONG1IZhjoR:0".to_string()],
                    vec!["IwyQtdONG1IZhjoR:1".to_string()],
                    vec!["IwyQtdONG1IZhjoR:2".to_string()],
                ],
            },
        },
        RackItem {
            id: "IwyQtdONG1IZhjoR".to_string(),
            note: "Sine".to_string(),
            point: [22.0, 1.0],
            width: 8.0,
            color: "success".to_string(),
            title: "Oscillator".to_string(),
            io: Io {
                audio: vec![vec![], vec!["Out".to_string()]],
                midi: vec![vec![], vec![]],
                control: vec![
                    vec![
                        "Volume".to_string(),
                        "Pitch".to_string(),
                        "Modulation".to_string(),
                    ],
                    vec![],
                ],
            },
            routing: Routing {
                audio: vec![vec!["xrJzTHxGw8mHe6bX:0".to_string()]],
                midi: vec![],
                control: vec![],
            },
        },
        RackItem {
            id: "xrJzTHxGw8mHe6bX".to_string(),
            note: "Compressor".to_string(),
            point: [32.0, 0.0],
            width: 8.0,
            color: "warning".to_string(),
            title: "Compressor".to_string(),
            io: Io {
                audio: vec![
                    vec!["L / Mono".to_string(), "R".to_string()],
                    vec!["L / Mono".to_string(), "R".to_string()],
                ],
                midi: vec![vec![], vec![]],
                control: vec![vec![], vec![]],
            },
            routing: Routing {
                audio: vec![vec!["Ewy3LJlRxAA5PmO2:0".to_string()], vec![]],
                midi: vec![],
                control: vec![],
            },
        },
        RackItem {
            id: "Ewy3LJlRxAA5PmO2".to_string(),
            note: "Concert Hall".to_string(),
            point: [48.0, 0.0],
            width: 8.0,
            color: "dark".to_string(),
            title: "Reverb".to_string(),
            io: Io {
                audio: vec![
                    vec!["L / Mono".to_string(), "R".to_string()],
                    vec!["L".to_string(), "R".to_string()],
                ],
                midi: vec![vec![], vec![]],
                control: vec![vec![], vec![]],
            },
            routing: Routing {
                audio: vec![
                    vec!["4ttJBfenaQYrDjLt:0".to_string()],
                    vec!["4ttJBfenaQYrDjLt:1".to_string()],
                ],
                midi: vec![],
                control: vec![],
            },
        },
        RackItem {
            id: "4ttJBfenaQYrDjLt".to_string(),
            note: "Main Out".to_string(),
            point: [60.0, 0.0],
            width: 8.0,
            color: "dark".to_string(),
            title: "Audio Output".to_string(),
            io: Io {
                audio: vec![vec!["Left".to_string(), "Right".to_string()], vec![]],
                midi: vec![vec![], vec![]],
                control: vec![vec![], vec![]],
            },
            routing: Routing {
                audio: vec![],
                midi: vec![],
                control: vec![],
            },
        },
    ]
}
