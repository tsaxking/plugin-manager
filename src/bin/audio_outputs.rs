use cpal::traits::{DeviceTrait, HostTrait};


fn main() -> anyhow::Result<()> {
    let hosts = cpal::available_hosts();
    for host_id in hosts {
        let host = cpal::host_from_id(host_id)?;
        for device in host.devices()? {
            println!("  {}", device.name()?);
        }
    }

    Ok(())
}