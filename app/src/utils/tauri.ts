import { invoke } from '@tauri-apps/api/tauri';
import { attempt, attemptAsync } from './check';

export const call = <T>(event: string, payload: unknown) => attemptAsync(async () => {
    if (event.includes(':')) throw new Error('Event name cannot contain ":"');
    return invoke('global', {
        data: {
            event,
            payload: JSON.stringify(payload),
        }
    }) as Promise<T>;
});

export const direct = <T>(event: string, payload: unknown = null) => attemptAsync(async () => {
    return await invoke(event, {
        data: payload,
    }) as T;
});


let id = -1;
export class Streamer<T> {
    public static readonly streamers = new Map<number, Streamer<unknown>>();

    constructor() {
        Streamer.streamers.set(this.id, this);
    }

    public readonly id = id++;
    private packetId = -1;
    private running = false;

    public start() {
        return attempt(() => {
            if (this.running) throw new Error('Streamer already running');
            this.running = true;
            call('start_streamer', {
                id: this.id,
            });
        });
    }

    public stop() {
        if (!this.running) return;
        call('stop_streamer', {
            id: this.id,
        });

        Streamer.streamers.delete(this.id);
    }

    public send(payload: T) {
        call('send_streamer_data', {
            id: this.id,
            payload,
            packetId: this.packetId++,
        });
    }
}

window.addEventListener('close', () => {
    for (const streamer of Streamer.streamers.values()) {
        streamer.stop();
    }
});