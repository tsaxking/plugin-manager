import { attempt } from "../utils/check";
import { EventEmitter } from "../utils/event-emitter";
import { Point2D } from "../utils/calcs/linear-algebra/point";
import { IO, io } from "./io";
import { Color } from "../utils/color";
import { abbreviate } from "../utils/text";
import { Cable } from "./cable";

export const colors = {
    audio: Color.fromHex('#425df5'),
    midi: Color.fromHex('#30a136'),
    control: Color.fromHex('#f54242'),
}

type Events = {
    'destroy': void;
    'move': { x: number, y: number };
    'update': void;
};

type GlobalEvents = {
    'destroy': RackItem;
    'move': RackItem;
    'update': RackItem;
    'new': RackItem;
    'display': 'io' | 'control';
}

export class RackItem {
    private static _display: 'io' | 'control' = 'io';
    public static get display() { return this._display; }
    public static set display(value: 'io' | 'control') {
        this._display = value;
        RackItem.emit('display', value);
    }

    private static readonly emitter = new EventEmitter<keyof GlobalEvents>();
    public static on<K extends keyof GlobalEvents>(event: K, listener: (e: GlobalEvents[K]) => void): void {
        this.emitter.on(event, listener);
    }

    public static off<K extends keyof GlobalEvents>(event: K, listener?: (e: GlobalEvents[K]) => void): void {
        this.emitter.off(event, listener);
    }

    public static emit<K extends keyof GlobalEvents>(event: K, e: GlobalEvents[K]): void {
        this.emitter.emit(event, e);
    }

    public static items: RackItem[] = [];

    private readonly emitter = new EventEmitter<keyof Events>();

    public static getAvailablePoint() {
        const items = RackItem.items.slice();
        items.sort((a, b) => {
            if (a.y !== b.y) return a.y - b.y;
            return a.x - b.x;
        });

        let y = 0;
        let x = 0;
        for (const item of items) {
            if (item.y !== y) {
                y = item.y;
                x = 0;
            }
            x = item.end;
        }
        return [x, y] as Point2D;
    }

    public static serialize() {
        return JSON.stringify(RackItem.items.map(i => i.serialize()));
    }

    public static deserialize(data: string) {
        const items = JSON.parse(data) as unknown[];
        if (!Array.isArray(items)) throw new Error('Invalid data');
        if (items.some(i => typeof i !== 'object')) throw new Error('Invalid data');
        // if (items.some(i => (i as { id: string }).id)) throw new Error('Invalid data');
        const rackItems = items as {
            id: string;
            note: string;
            point: Point2D;
            width: number;
            color: 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'light' | 'dark' | 'warning';
            title: string;
            io: io;
            routing: {
                audio: string[][];
                midi: string[][];
                control: string[][];
            }
        }[];
        
        RackItem.items = [];

        const generated = rackItems.map(i => new RackItem(
            i.id,
            i.note,
            i.point,
            i.width,
            i.color,
            i.title,
            i.io
        ));

        for (const g of generated) {
            const item = rackItems.find(i => i.id === g.id);
            if (!item) throw new Error('Invalid data'); // should never happen
            g.io.audio.deserialize(item.routing.audio);
            g.io.midi.deserialize(item.routing.midi);
            g.io.control.deserialize(item.routing.control);
        }

        return generated;
    }

    public x = 0;
    public y = 0;
    public io: {
        midi: IO;
        audio: IO;
        control: IO;
    };

    private readonly _note: string;

    constructor(
        public readonly id: string,
        note: string,
        point: Point2D,
        public width: number,
        public color: 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'light' | 'dark' | 'warning',
        public readonly title: string,
        io: io,
    ) {
        if (this.width < 8) throw new Error('Invalid width');
        [this.x, this.y] = point;

        this.io = {
            midi: new IO('midi', ...io.midi, this),
            audio: new IO('audio', ...io.audio, this),
            control: new IO('control', ...io.control, this),
        };
        this._note = note;

        RackItem.items.push(this);
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
            const { items } = RackItem;
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
        const index = RackItem.items.indexOf(this);
        if (index !== -1) {
            RackItem.items.splice(index, 1);
            this.emit('destroy', undefined);
        }
    }

    on<K extends keyof Events>(event: K, listener: (e: Events[K]) => void): void {
        this.emitter.on(event, listener);
    }
    
    off<K extends keyof Events>(event: K, listener?: (e: Events[K]) => void): void {
        this.emitter.off(event, listener);
    }

    emit<K extends keyof Events>(event: K, e: Events[K]): void {
        this.emitter.emit(event, e);
    }

    update() {

    }

    serialize() {
        return {
            id: this.id,
            note: this._note,
            point: [this.x, this.y] as Point2D,
            width: this.width,
            color: this.color,
            title: this.title,
            io: {
                audio: [this.io.audio.inputs.map(i => i.name), this.io.audio.outputs.map(o => o.name)],
                midi: [this.io.midi.inputs.map(i => i.name), this.io.midi.outputs.map(o => o.name)],
                control: [this.io.control.inputs.map(i => i.name), this.io.control.outputs.map(o => o.name)],
            },
            routing: {
                audio: this.io.audio.serialize(),
                midi: this.io.midi.serialize(),
                control: this.io.control.serialize(),
            }
        }
    }

    get cables() {
        const cables = Cable.all;
        return cables.filter(c => Object.is(c.input.rackItem, this) || Object.is(c.output.rackItem, this));
    }
};

Object.assign(window, { RackItem });