import WebSocket from "@tauri-apps/plugin-websocket";
import { attemptAsync } from "./check";
import { EventEmitter } from "./event-emitter";


export class Socket {
    private ws?: WebSocket;
    private readonly eventEmitter = new EventEmitter();

    get connected() {
        return !!this.ws;
    }

    constructor(public readonly address: string) {
    }

    connect() {
        return attemptAsync(async () => {
            if (this.ws) return this.ws;
            const ws = await WebSocket.connect(this.address);
            this.ws = ws;
            this.ws.addListener((msg) => {
                const { data } = msg;
                if (typeof data !== 'string') return;
                const { event, payload } = JSON.parse(data) as {
                    event: string;
                    payload: unknown;
                };

                this.eventEmitter.emit(event, payload);
            });
            return ws;
        });
    }


    on(event: string, callback: (data: unknown) => void) {
        this.eventEmitter.on(event, callback);
    }

    off(event: string, callback?: (data: unknown) => void) {
        this.eventEmitter.off(event, callback);
    }

    emit(event: string, payload: unknown) {
        if (!this.ws) return;
        this.ws.send(JSON.stringify({ event, payload }));
    }

    close() {
        return attemptAsync(async () => {
            if (!this.ws) throw new Error('Socket not connected');
            return this.ws.disconnect();
        });
    }

    once(event: string, callback: (data: unknown) => void) {
        this.eventEmitter.once(event, callback);
    }
}

export const socket = new Socket('ws://localhost:8080');
socket.connect();