import { RackItem } from "./rack-item";
import { EventEmitter } from "../utils/event-emitter";
import { attempt } from "../utils/check";

export type io = {
    midi: [number, number];
    audio: [number, number];
    cv: [number, number];
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

class Input extends IOEmitter<InputEvents> {
    public connections: Output[] = [];

    constructor(public readonly type: 'midi' | 'audio' | 'cv', public readonly io: IO) {
        super();
    };

    connect(output: Output) {
        return attempt(() => {
            if (this.type !== output.type) throw new Error('Cannot connect different types');
            this.connections.push(output);
        });
    }

    disconnect(output: Output) {
        this.connections = this.connections.filter(c => c !== output);
    }
}

class Output extends IOEmitter<OutputEvents> {
    public connections: Input[] = [];

    constructor(public readonly type: 'midi' | 'audio' | 'cv', public readonly io: IO) {
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
}


export class IO extends IOEmitter<IOEvents> {
    public readonly inputs: Input[];
    public readonly outputs: Output[];
    
    constructor(
        public readonly type: 'midi' | 'audio' | 'cv',
        inputs: number,
        outputs: number,
        public readonly rackItem: RackItem
    ) {
        super();
        this.inputs = Array.from({ length: inputs}, () => new Input(type, this));
        this.outputs = Array.from({ length: outputs}, () => new Output(type, this));
    }
}