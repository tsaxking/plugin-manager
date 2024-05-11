import { attempt } from '../utils/check';
import { EventEmitter } from '../utils/event-emitter';
import { Point2D } from '../utils/calcs/linear-algebra/point';
import { IO, io } from './io';
import { Color } from '../utils/color';
import { abbreviate } from '../utils/text';
import { Rack } from './state';

export const colors = {
    audio: Color.fromHex('#425df5'),
    midi: Color.fromHex('#30a136'),
    control: Color.fromHex('#f54242'),
};

type Events = {
    destroy: void;
    move: { x: number; y: number };
    update: void;
};

type GlobalEvents = {
    destroy: RackItem;
    move: RackItem;
    update: RackItem;
    new: RackItem;
    display: 'io' | 'control';
};

export class RackItem {
    private static readonly emitter = new EventEmitter<keyof GlobalEvents>();
    public static on<K extends keyof GlobalEvents>(
        event: K,
        listener: (e: GlobalEvents[K]) => void
    ): void {
        this.emitter.on(event, listener);
    }

    public static off<K extends keyof GlobalEvents>(
        event: K,
        listener?: (e: GlobalEvents[K]) => void
    ): void {
        this.emitter.off(event, listener);
    }

    public static emit<K extends keyof GlobalEvents>(
        event: K,
        e: GlobalEvents[K]
    ): void {
        this.emitter.emit(event, e);
    }

    private readonly emitter = new EventEmitter<keyof Events>();

    public x = 0;
    public y = 0;
    public io: {
        midi: IO;
        audio: IO;
        control: IO;
    };

    private readonly _note: string;

    constructor(
        public readonly rack: Rack,
        public readonly id: string,
        note: string,
        point: Point2D,
        public width: number,
        public color:
            | 'primary'
            | 'secondary'
            | 'success'
            | 'danger'
            | 'info'
            | 'dark'
            | 'warning',
        public readonly title: string,
        io: io
    ) {
        if (this.width < 8) throw new Error('Invalid width');
        [this.x, this.y] = point;

        this.io = {
            midi: new IO('midi', io.midi, this),
            audio: new IO('audio', io.audio, this),
            control: new IO('control', io.control, this),
        };
        this._note = note;

        rack.items.push(this);
        RackItem.emit('new', this);
    }

    get note() {
        return abbreviate(this._note, 10 + Math.floor(this.width * 1.25));
    }

    get end() {
        return this.x + this.width;
    }

    moveTo(x: number, y: number) {
        return attempt(() => {
            if (x < 0 || y < 0) throw new Error('Invalid position');
            // console.log('moving to', x, y);
            // check if the new position is valid
            const { items } = this.rack;
            const end = x + this.width;

            for (const item of items) {
                if (item === this) continue;
                if (item.y === y) {
                    if (item.x < end && item.end > x) {
                        throw new Error('Invalid position');
                    }
                }
            }

            this.x = x;
            this.y = y;
            this.emit('move', { x, y });
            RackItem.emit('move', this);
        });
    }

    destroy() {
        const index = this.rack.items.indexOf(this);
        if (index !== -1) {
            this.io.audio.destroy();
            this.io.midi.destroy();
            this.io.control.destroy();
            this.rack.items = this.rack.items.filter(i => i !== this);
            RackItem.emit('destroy', this);
        }
    }

    on<K extends keyof Events>(
        event: K,
        listener: (e: Events[K]) => void
    ): void {
        this.emitter.on(event, listener);
    }

    off<K extends keyof Events>(
        event: K,
        listener?: (e: Events[K]) => void
    ): void {
        this.emitter.off(event, listener);
    }

    emit<K extends keyof Events>(event: K, e: Events[K]): void {
        this.emitter.emit(event, e);
    }

    update() {}

    serialize() {
        return {
            id: this.id,
            note: this._note,
            point: [this.x, this.y] as Point2D,
            width: this.width,
            color: this.color,
            title: this.title,
            io: {
                audio: {
                    inputs: this.io.audio.inputs.map(i => i.name),
                    outputs: this.io.audio.outputs.map(o => o.name),
                },
                midi: {
                    inputs: this.io.midi.inputs.map(i => i.name),
                    outputs: this.io.midi.outputs.map(o => o.name),
                },
                control: {
                    inputs: this.io.control.inputs.map(i => i.name),
                    outputs: this.io.control.outputs.map(o => o.name),
                },
            },
            routing: {
                audio: this.io.audio.serialize(),
                midi: this.io.midi.serialize(),
                control: this.io.control.serialize(),
            },
        };
    }
}
