import { RackItem } from './rack-item';
import { EventEmitter } from '../utils/event-emitter';
import { attempt } from '../utils/check';
import { Point } from '../utils/calcs/linear-algebra/point';
import { Rack } from './state';

const { max } = Math;

export type io = {
    midi: [string[], string[]];
    audio: [string[], string[]];
    control: [string[], string[]];
};

type InputEvents = {
    connect: Output;
    disconnect: Output;
};

type OutputEvents = {
    connect: Input;
    disconnect: Input;
};

type IOEvents = {
    connect: { input: Input; output: Output };
    disconnect: { input: Input; output: Output };
    change: void;
};

class IOEmitter<Events> {
    public readonly emitter = new EventEmitter<keyof Events>();

    on<K extends keyof Events>(event: K, cb: (data: Events[K]) => void) {
        this.emitter.on(event, cb);
    }

    emit<K extends keyof Events>(event: K, data: Events[K]) {
        this.emitter.emit(event, data);
    }

    off<K extends keyof Events>(event: K, cb: (data: Events[K]) => void) {
        this.emitter.off(event, cb);
    }
}

// font size + margin + padding
const IO_SIZE = 18 + 10 + 4;

export class Input extends IOEmitter<InputEvents> {
    // public connections: Output[] = [];
    public point = new Point(0, 0);

    constructor(
        public readonly type: 'midi' | 'audio' | 'control',
        public readonly io: IO,
        public readonly name: string
    ) {
        super();
    }

    // connect(output: Output) {
    //     return attempt(() => {
    //         if (this.rackItem.id === output.rackItem.id) throw new Error('Cannot connect to itself');
    //         if (this.type !== output.type) throw new Error('Cannot connect different types');
    //         this.connections.push(output);
    //     });
    // }

    // disconnect(output: Output) {
    //     this.connections = this.connections.filter(c => c !== output);
    // }

    update() {
        const { type } = this;
        const { x, y } = this.rackItem;
        const { index } = this;

        const maxAudio = max(
            this.rackItem.io.audio.inputs.length,
            this.rackItem.io.audio.outputs.length
        );
        const maxMidi = max(
            this.rackItem.io.midi.inputs.length,
            this.rackItem.io.midi.outputs.length
        );

        let displacement = 0;
        switch (type) {
            case 'control':
                displacement = maxAudio + maxMidi + index;
                break;
            case 'midi':
                displacement = maxAudio + index;
                break;
            case 'audio':
                displacement = index;
                break;
        }

        this.point.x = x * 16;
        this.point.y = y * 380 + 60 + displacement * IO_SIZE + 16;

        return this.point;
    }

    get rackItem() {
        return this.io.rackItem;
    }

    get index() {
        return this.io.inputs.indexOf(this);
    }

    isConnected(output: Output) {
        return output.isConnected(this);
    }

    get connections() {
        return this.io.rackItem.rack.items.filter(
            (rackItem) => {
                return rackItem.io[this.type].outputs.some(
                    (output) => output.connections.some(
                        (input) => input === this
                    )
                )
            }
        )
    }
}

export class Output extends IOEmitter<OutputEvents> {
    public connections: Input[] = [];
    public point = new Point(0, 0);

    constructor(
        public readonly type: 'midi' | 'audio' | 'control',
        public readonly io: IO,
        public readonly name: string
    ) {
        super();
    }

    connect(input: Input) {
        return attempt(() => {
            if (this.type !== input.type)
                throw new Error('Cannot connect different types');
            if (this.rackItem.id === input.rackItem.id)
                throw new Error('Cannot connect to itself');
            if (this.connections.length) {
                throw new Error('Output already connected');
            }
            if (input.connections.length) {
                throw new Error('Input already connected');
            }
            this.connections.push(input);
            this.emit('connect', input);
            IO.emit('change', undefined);
        });
    }

    disconnect(input: Input) {
        this.connections = this.connections.filter(c => c !== input);
        IO.emit('change', undefined);
    }

    update() {
        const { type } = this;
        const { x, y } = this.io.rackItem;
        const index = this.io.outputs.indexOf(this);

        const maxAudio = max(
            this.rackItem.io.audio.inputs.length,
            this.rackItem.io.audio.outputs.length
        );
        const maxMidi = max(
            this.rackItem.io.midi.inputs.length,
            this.rackItem.io.midi.outputs.length
        );

        let displacement = 0;
        switch (type) {
            case 'control':
                displacement = maxAudio + maxMidi + index;
                break;
            case 'midi':
                displacement = maxAudio + index;
                break;
            case 'audio':
                displacement = index;
                break;
        }

        this.point.x = x * 16 + 16 * this.io.rackItem.width;
        this.point.y = y * 380 + 60 + displacement * IO_SIZE + 16;

        return this.point;
    }

    get rackItem() {
        return this.io.rackItem;
    }

    get index() {
        return this.io.outputs.indexOf(this);
    }

    isConnected(input: Input) {
        return this.connections.includes(input);
    }
}

export class IO extends IOEmitter<IOEvents> {
    private static readonly emitter = new EventEmitter<keyof IOEvents>();

    public static on<K extends keyof IOEvents>(
        event: K,
        cb: (data: IOEvents[K]) => void
    ) {
        IO.emitter.on(event, cb);
    }

    public static emit<K extends keyof IOEvents>(event: K, data: IOEvents[K]) {
        IO.emitter.emit(event, data);
    }

    public static off<K extends keyof IOEvents>(
        event: K,
        cb: (data: IOEvents[K]) => void
    ) {
        IO.emitter.off(event, cb);
    }

    public readonly inputs: Input[];
    public readonly outputs: Output[];

    constructor(
        public readonly type: 'midi' | 'audio' | 'control',
        inputs: string[],
        outputs: string[],
        public readonly rackItem: RackItem
    ) {
        super();
        this.inputs = inputs.map(i => new Input(type, this, i));
        this.outputs = outputs.map(o => new Output(type, this, o));
    }

    serialize() {
        return this.outputs.map(o =>
            o.connections.map(i => i.rackItem.id + ':' + i.index)
        );
    }

    deserialize(rack: Rack, data: string[][]) {
        for (const outputIndex in data) {
            const output = data[outputIndex];
            for (const connection of output) {
                const [id, inputIndex] = connection.split(':');
                const output =
                    this.rackItem.io[this.type].outputs[+outputIndex];
                const input = rack.items.find(i => i.id === id)?.io[this.type]
                    .inputs[+inputIndex];
                if (output && input) {
                    output.connect(input);
                } else {
                    console.warn('Unable to connect IOs: ', output, input);
                }
            }
        }
    }
}
