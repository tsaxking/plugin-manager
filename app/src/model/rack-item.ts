import { attemptAsync, Result } from "../utils/check";
import { Channel } from "./channel";


export class RackItem {
    public static all() {
        return attemptAsync(async () => {
            return [
                new RackItem({
                    id: 1,
                    name: 'Rack 1',
                    inputGain: 0,
                    outputGain: 0,
                    active: false,
                }),
                new RackItem({
                    id: 2,
                    name: 'Rack 2',
                    inputGain: 0,
                    outputGain: 0,
                    active: true,
                }),
            ];
        });
    }

    public readonly id: number;
    public readonly name: string;
    private _inputGain: number;
    private _outputGain: number;
    private _active: boolean;

    constructor(data: {
        id: number;
        name: string;
        inputGain: number;
        outputGain: number;
        active: boolean;
    }) {
        this.id = data.id;
        this.name = data.name;
        this._inputGain = data.inputGain;
        this._outputGain = data.outputGain;
        this._active = data.active;
    }

    get inputGain() {
        return this._inputGain;
    }

    set inputGain(value) {
        this._inputGain = value;
    }

    get outputGain() {
        return this._outputGain;
    }

    set outputGain(value) {
        this._outputGain = value;
    }

    get active() {
        return this._active;
    }

    set active(value) {
        this._active = value;
    }

    getIOStream(): Promise<Result<[AudioNode, AudioNode]>> {
        return attemptAsync(() => {
            return new Promise(res => {
                const sample = '/app/samples/file_example_WAV_1MG.wav';
                const audioContext = new AudioContext();
                const source = audioContext.createBufferSource();
                
                document.onclick = async () => {
                    const response = await fetch(sample);
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                    source.buffer = audioBuffer;
                    source.connect(audioContext.destination);
                    source.start();
                    res([source, audioContext.destination]);
                }
            })
        });
    }

    getChannel() {
        return attemptAsync(async () => {
            const channels = (await Channel.getChannels()).unwrap();
            return channels.find((c) => c.rack.includes(this.id));
        });
    }

    insertAfter(item: RackItem) {
        return attemptAsync(async () => {
            const channel = (await this.getChannel()).unwrap();
            if (!channel) throw new Error('Rack item not in use');
            const index = channel.rack.indexOf(this.id);
            channel.rack.splice(index + 1, 0, item.id);
        });
    }

    insertBefore(item: RackItem) {
        return attemptAsync(async () => {
            const channel = (await this.getChannel()).unwrap();
            if (!channel) throw new Error('Rack item not in use');
            const index = channel.rack.indexOf(this.id);
            channel.rack.splice(index, 0, item.id);
        });
    }

    remove() {
        return attemptAsync(async () => {
            const channel = (await this.getChannel()).unwrap();
            if (!channel) throw new Error('Rack item not in use');
            const index = channel.rack.indexOf(this.id);
            channel.rack.splice(index, 1);
        });
    }
}