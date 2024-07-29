import { attemptAsync, Result } from '../utils/check';
import { AudioIO } from './io';
import { RackItem } from './rack-item';

// settings
// - lock stereo: Force stereo channels to be 1-2, 3-4, 5-6, etc
// - 

export class Channel {
    public static getChannels(): Promise<Result<Channel[]>> {
        return attemptAsync(async () => {
            return channels;
        });
    }

    private _gain;
    private _fader;
    private _type: 'mono' | 'stereo';
    public readonly id: number;
    public _name: string;
    public readonly rack: number[];

    constructor(data: {
        id: number;
        gain: number;
        fader: number;
        type: 'mono' | 'stereo';
        name: string;
        rack: number[];
    }) {
        this.id = data.id;
        this._gain = data.gain;
        this._fader = data.fader;
        this._type = data.type;
        this._name = data.name;
        this.rack = data.rack;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
        this.emit('channel-name', value);
    }

    get gain() {
        return this._gain;
    }

    set gain(value) {
        this._gain = value;
        this.emit('channel-gain', value);
    }

    get fader() {
        return this._fader;
    }

    set fader(value) {
        this._fader = value;
        this.emit('channel-fader', value);
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
        this.emit('channel-type', value);
    }

    getInput() {
        return attemptAsync(async () => {
            const inputs = await AudioIO.getInputs();
            return inputs.unwrap().find(o => o.channel === this);
        });
    }

    getOutput() {
        return attemptAsync(async () => {
            const outputs = await AudioIO.getOutputs();
            return outputs.unwrap().find(o => o.channel === this);
        });
    }

    addRackItem(item: RackItem, index: number) {
        return attemptAsync(async () => {
            const c = (await (item.getChannel())).unwrap();
            if (c) throw new Error('Rack item already in use');
            this.rack.splice(index, 0, item.id);
        });
    }

    getRack() {
        return attemptAsync(async () => {
            const all = (await RackItem.all()).unwrap();
            return all.filter(i => this.rack.includes(i.id));
        });
    }

    private emit(event: string, data: unknown) {
        window.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
}


const channels = new Array(
    12
).fill(0).map((_, i) => new Channel({
    name: 'Channel ' + (i + 1),
    gain: Math.random() * 48 - 24,
    fader: 0,
    rack: [],
    type: 'mono',
    id: i,
}));

Object.assign(window, { Channel, channels });