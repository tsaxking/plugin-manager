use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use fundsp::hacker::*;
use pm::commands;
use std::io::Write;
use std::sync::mpsc;
use std::thread;

fn main() -> anyhow::Result<()> {
    pm::rack::init_app_state(vec![]);

    let host = cpal::default_host();
    let device = host
        .default_output_device()
        .expect("Failed to find a default output device");
    let config = device.default_output_config().unwrap();

    let (tx, rx): (mpsc::Sender<usize>, mpsc::Receiver<usize>) = mpsc::channel();
    pm::rack::init_play_tx(tx);

    let thread_handles = [
        // Audio Thread
        thread::spawn(move || {
            let stream = match config.sample_format() {
                cpal::SampleFormat::F32 => {
                    make_stream::<f32>(&device, &config.clone().into()).unwrap()
                }
                cpal::SampleFormat::I16 => {
                    make_stream::<i16>(&device, &config.clone().into()).unwrap()
                }
                cpal::SampleFormat::U16 => {
                    make_stream::<u16>(&device, &config.clone().into()).unwrap()
                }
                _ => panic!("Unsupported format"),
            };
            loop {
                stream.play().unwrap();
                rx.recv().unwrap();
                stream.pause().unwrap();
                rx.recv().unwrap();
            }
        }),
        // CLI thread
        #[cfg(debug_assertions)]
        thread::spawn(move || {
            use pm::console;
            let mut stdout = std::io::stdout();
            let cli = console::commands();
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
        }),
    ];

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::get_effects_state,
            commands::toggle_playback,
            commands::save_load::save,
            commands::save_load::load,
        ])
        .run(tauri::generate_context!())
        .unwrap();

    for handle in thread_handles.into_iter() {
        handle.join().unwrap();
    }

    Ok(())
}

fn make_stream<T>(
    device: &cpal::Device,
    config: &cpal::StreamConfig,
) -> anyhow::Result<cpal::Stream>
where
    T: cpal::SizedSample + cpal::FromSample<f64>,
{
    let sample_rate = config.sample_rate.0 as f64;
    let channels = config.channels as usize;

    let c = 0.2
        * (triangle_hz(midi_hz(60.0))
            + triangle_hz(midi_hz(64.0))
            + triangle_hz(midi_hz(67.0)));

    let c = c >> pan(0.0);
    let mut c = c
        >> (declick() | declick())
        >> (dcblock() | dcblock())
        >> limiter_stereo((1.0, 5.0));

    c.set_sample_rate(sample_rate);
    c.allocate();

    let mut next_value = move || c.get_stereo();
    let err_fn = |err| eprintln!("an error occurred on stream: {}", err);

    let stream = device.build_output_stream(
        config,
        move |data: &mut [T], _: &cpal::OutputCallbackInfo| {
            write_data(data, channels, &mut next_value)
        },
        err_fn,
        None,
    )?;

    Ok(stream)
}

fn write_data<T>(
    output: &mut [T],
    channels: usize,
    next_sample: &mut dyn FnMut() -> (f64, f64),
) where
    T: cpal::SizedSample + cpal::FromSample<f64>,
{
    for frame in output.chunks_mut(channels) {
        let sample = next_sample();
        let left = T::from_sample(sample.0);
        let right = T::from_sample(sample.1);

        for (channel, sample) in frame.iter_mut().enumerate() {
            if channel & 1 == 0 {
                *sample = left;
            } else {
                *sample = right;
            }
        }
    }
}
