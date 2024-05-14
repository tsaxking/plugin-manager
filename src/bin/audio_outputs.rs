use cpal::traits::{DeviceTrait, HostTrait};
use pm::console::commands;


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

    commands().add(
        String::from("audio"), Box::new(move |args: Vec<&str>| {
            let i = args.first().unwrap().parse::<usize>().unwrap();
            let device = map.get(&i);

            if let Some(d) = device {
                format!("Selected device: {:?}", d.name())
            } else {
                String::from("Device not found")
            }
        }));

    Ok(())
}
