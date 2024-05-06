import { attempt } from "../utils/check";
import { EventEmitter } from "../utils/event-emitter";
import { Point2D } from "../utils/calcs/linear-algebra/point";
import { IO, io } from "./io";

type Events = {
    'destroy': void;
    'move': { x: number, y: number };
    'update': void;
}

export class RackItem {
    public static readonly items: RackItem[] = [];

    private readonly emitter = new EventEmitter<keyof Events>();

    public x = 0;
    public y = 0;
    public io: {
        midi: IO;
        audio: IO;
        cv: IO;
    };


    constructor(
        point: Point2D,
        public width: number,
        public color: 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'light' | 'dark' | 'warning',
        public readonly title: string,
        io: io,
        public note: string,
    ) {
        if (this.width < 8) throw new Error('Invalid width');
        RackItem.items.push(this);

        [this.x, this.y] = point;

        this.io = {
            midi: new IO('midi', ...io.midi, this),
            audio: new IO('audio', ...io.audio, this),
            cv: new IO('cv', ...io.cv, this),
        };
    }

    get end() {
        return this.x + this.width;
    }

    move(x: number, y: number) {
        return attempt(() => {
            // check if the new position is valid
            const { items } = RackItem;
            const vertical = items.filter(item => item.y === y);
            const horizontal = vertical.filter(item => {
                // check start position
                if (this.end <= item.x) return false;
                if (this.x >= item.end) return false;
                return true;
            });
            if (horizontal.length) throw new Error('Invalid position');
    
            this.x = x;
            this.y = y;
            this.emit('move', { x, y });
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