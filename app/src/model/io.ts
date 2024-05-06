import { RackItem } from "./rack-item";
import { EventEmitter } from "../utils/event-emitter";
import { attempt } from "../utils/check";
import { Point } from "../utils/calcs/linear-algebra/point";

const { max } = Math;

export type io = {
    midi: [string[], string[]];
    audio: [string[], string[]];
    control: [string[], string[]];
};

type InputEvents = {
    connect: Output;
    disconnect: Output;
}

type OutputEvents = {
    connect: Input;
    disconnect: Input;
}

type IOEvents = {
    connect: { input: Input, output: Output };
    disconnect: { input: Input, output: Output };
}

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
const IO_SIZE = 18+10+4;

export class Input extends IOEmitter<InputEvents> {
    // public connections: Output[] = [];

    constructor(public readonly type: 'midi' | 'audio' | 'control', public readonly io: IO, public readonly name: string) {
        super();
    };

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

    get point() {
        const { type } = this;
        const { x, y } = this.rackItem;
        const index = this.io.inputs.indexOf(this);

        const maxAudio = max(this.rackItem.io.audio.inputs.length, this.rackItem.io.audio.outputs.length);
        const maxMidi = max(this.rackItem.io.midi.inputs.length, this.rackItem.io.midi.outputs.length);

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


        return new Point(
            x * 16,
            y * 380 + 60 + displacement * IO_SIZE + 16
        );
    }

    get rackItem() {
        return this.io.rackItem;
    }
}

export class Output extends IOEmitter<OutputEvents> {
    public connections: Input[] = [];

    constructor(public readonly type: 'midi' | 'audio' | 'control', public readonly io: IO, public readonly name: string) {
        super();
    };

    connect(input: Input) {
        return attempt(() => {
            if (this.type !== input.type) throw new Error('Cannot connect different types');
            this.connections.push(input);
        });
    }

    disconnect(input: Input) {
        this.connections = this.connections.filter(c => c !== input);
    }

    get point() {
        const { type } = this;
        const { x, y } = this.io.rackItem;
        const index = this.io.outputs.indexOf(this);

        const maxAudio = max(this.rackItem.io.audio.inputs.length, this.rackItem.io.audio.outputs.length);
        const maxMidi = max(this.rackItem.io.midi.inputs.length, this.rackItem.io.midi.outputs.length);


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

        return new Point(
            x * 16 + 16 * this.io.rackItem.width,
            y * 380 + 60 + displacement * IO_SIZE + 16
        );
    }

    get rackItem() {
        return this.io.rackItem;
    }
}


export class IO extends IOEmitter<IOEvents> {
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
}