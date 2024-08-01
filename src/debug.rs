use bevy::prelude::*;
use bevy_egui::egui;
use bevy_egui::{egui::RichText, EguiContexts};
use std::time::Instant;

#[derive(Resource)]
pub struct LastFrameTime {
    pub time: Instant,
}

#[derive(Resource, Default)]
pub struct DebugStats {
    pub frame_time: f32,
    pub memory_usage: f32,
}

#[derive(Resource)]
pub struct FrameRate {
    buf: [f32; 40],
    i: usize,
}

impl FrameRate {
    pub fn new() -> Self {
        FrameRate {
            buf: [0.0; 40],
            i: 0,
        }
    }

    pub fn calc(&self) -> f32 {
        self.buf.iter().sum::<f32>() / 40.
    }

    fn push(&mut self, new_rate: f32) {
        self.buf[self.i] = new_rate;
        self.next_index();
    }

    fn next_index(&mut self) {
        if self.i == 39 {
            self.i = 0;
        } else {
            self.i += 1;
        }
    }
}

impl Default for FrameRate {
    fn default() -> Self {
        Self::new()
    }
}

pub fn set_stats(
    mut frame_time_counter: ResMut<LastFrameTime>,
    mut debug_stats: ResMut<DebugStats>,
    mut frame_rate: ResMut<FrameRate>,
) {
    debug_stats.frame_time = frame_time_counter.time.elapsed().as_millis() as f32;
    frame_time_counter.time = Instant::now();
    frame_rate.push(1000.0 / debug_stats.frame_time);

    debug_stats.memory_usage = crate::PEAK_ALLOC.current_usage_as_mb();
}


#[cfg(debug_assertions)]
pub fn debug_ui(
    debug_stats: Res<DebugStats>,
    frame_rate: Res<FrameRate>,
    mut contexts: EguiContexts,
) {


    egui::SidePanel::right("debug")
        .show_separator_line(false)
        .exact_width(50.0)
        .show(contexts.ctx_mut(), |ui| {
            let fps = frame_rate.calc();
            let fps_text_raw = format!("{:.0} fps\n", fps);
            let fps_text = RichText::new(fps_text_raw)
                .color(egui::Color32::GREEN)
                .line_height(Some(7.0));
            let mem_text_raw = format!("{:.0} MB", debug_stats.memory_usage);
            let mem_text =
                RichText::new(mem_text_raw).color(egui::Color32::GREEN);

            ui.label(fps_text);
            ui.label(mem_text);
        });
}

