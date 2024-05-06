import { attempt } from "../utils/check";
import { EventEmitter } from "../utils/event-emitter";
import { Point2D } from "../utils/calcs/linear-algebra/point";
import { IO, io } from "./io";
import { Color } from "../utils/color";
import { abbreviate } from "../utils/text";

export const colors = {
    audio: Color.fromHex('#425df5'),
    midi: Color.fromHex('#30a136'),
    control: Color.fromHex('#f54242'),
}

type Events = {
    'destroy': void;
    'move': { x: number, y: number };
    'update': void;
}

export class RackItem {
    public static readonly items: RackItem[] = [];

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

    public x = 0;
    public y = 0;
    public io: {
        midi: IO;
        audio: IO;
        control: IO;
    };

    private readonly _note: string;

    constructor(
        point: Point2D,
        public width: number,
        public color: 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'light' | 'dark' | 'warning',
        public readonly title: string,
        io: io,
        note: string,
        public readonly id: string
    ) {
        if (this.width < 8) throw new Error('Invalid width');
        RackItem.items.push(this);

        [this.x, this.y] = point;

        this.io = {
            midi: new IO('midi', ...io.midi, this),
            audio: new IO('audio', ...io.audio, this),
            control: new IO('control', ...io.control, this),
        };
        this._note = note;
    }

    get note() {
        return abbreviate(this._note, 10 + Math.floor(this.width * 1.25));
    }

    get end() {
        return this.x + this.width;
    }

    move(x: number, y: number) {
        return attempt(() => {
            // check if the new position is valid
            const { items } = RackItem;
            const _y = this.y + y;
            const _x = this.x + x;
            const end = _x + this.width;

            for (const item of items) {
                if (item === this) continue;
                if (item.y === _y) {
                    if (item.x < end && item.end > _x) {
                        throw new Error('Invalid position');
                    }
                }
            }

            this.x += x;
            this.y += y;
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
};