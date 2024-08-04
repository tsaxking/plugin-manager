#[cfg(debug_assertions)]
pub mod debug;
pub mod ui;

#[cfg(debug_assertions)]
#[global_allocator]
pub static PEAK_ALLOC: peak_alloc::PeakAlloc = peak_alloc::PeakAlloc;
