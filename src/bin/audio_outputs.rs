use cpal::{traits::{DeviceTrait, HostTrait}, Device};
use pm::console::commands;
use std::io::Write;


fn main() -> anyhow::Result<()> {
    let hosts = cpal::available_hosts();

    let mut map = std::collections::HashMap::new();

    for host_id in hosts {
        let host = cpal::host_from_id(host_id)?;
        let mut i = 0;
        for device in host.output_devices()? {
            println!("[{}]: {:?}", i, device.name());
            map.insert(i, device);
            i += 1;
        }
    }


    let mut stdout = std::io::stdout();
    let cli = commands().add(
        String::from("audio"), Box::new(move |args: Vec<&str>| {
            let i = args.first().unwrap().parse::<usize>().unwrap();
            let device = map.get(&i);

            if let Some(d) = device {
                play(d);
                format!("Selected device: {:?}", d.name())
            } else {
                String::from("Device not found")
            }
        }));

    loop {
        let mut buf: String = Default::default();
        write!(stdout, "❯ ").unwrap();
        stdout.flush().unwrap();
        std::io::stdin().read_line(&mut buf).unwrap();
        let response = cli
            .run(&buf)
            .unwrap_or(String::from("Did not receive valid command"));
        writeln!(stdout, "{}", response).unwrap();
    }
}

fn play(device: &Device) {

}