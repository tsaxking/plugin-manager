use crate::TAURI_TX;
use bevy_ecs::{
    event::{Event, EventRegistry},
    world::World,
};
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Event, Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash)]
pub struct PlayEvent {
    id_: usize,
}

#[derive(Event, Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash)]
pub struct MyEvent {
    id_: usize,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum TauriEvent {
    MyEvent(MyEvent),
    Play(PlayEvent),
}


pub fn register_events(world: &mut World) {
    EventRegistry::register_event::<PlayEvent>(world);
    EventRegistry::register_event::<MyEvent>(world);
}

pub fn dispatch_event(world: &mut World, event: TauriEvent) {
    match event {
        TauriEvent::MyEvent(my_event) => {
            world.send_event(my_event);
        }
        TauriEvent::Play(play_event) => {
            world.send_event(play_event);
        }
    }
}

#[derive(Error, Serialize, Deserialize, Debug, Clone, PartialEq, PartialOrd)]
pub enum CommandError {
    #[error("The Tauri command channel has not been initialized")]
    ChannelNotExist,
    #[error("Failed to acquire mutex on command sender: it was poisoned")]
    MutexPoisoned,
    #[error("Failed to send the message on the channel.. is the reciever deallocated?")]
    SendFailed,
}

#[tauri::command]
pub fn global(data: TauriEvent) -> Result<(), CommandError> {
    let Some(mutex) = TAURI_TX.get() else {
        return Err(CommandError::ChannelNotExist);
    };

    let Ok(guard) = mutex.lock() else {
        return Err(CommandError::MutexPoisoned);
    };

    let Ok(_) = guard.send(data) else {
        return Err(CommandError::SendFailed);
    };

    Ok(())
}

