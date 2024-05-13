import { Point2D } from '../utils/calcs/linear-algebra/point';
import { EventEmitter } from '../utils/event-emitter';
import { RackItem, SerializedRackItem } from './rack-item';

type Events = {
    display: 'io' | 'control';
    perform: boolean;
};

export class Rack {
    private static readonly emitter = new EventEmitter<keyof Events>();

    public static on<K extends keyof Events>(
        event: K,
        listener: (data: Events[K]) => void
    ) {
        Rack.emitter.on(event, listener);
    }

    public static off<K extends keyof Events>(
        event: K,
        listener: (data: Events[K]) => void
    ) {
        Rack.emitter.off(event, listener);
    }

    private static emit<K extends keyof Events>(event: K, data: Events[K]) {
        Rack.emitter.emit(event, data);
    }

    private static _display: 'io' | 'control' = 'io';
    public static get display() {
        return this._display;
    }
    public static set display(value: 'io' | 'control') {
        this._display = value;
        Rack.emit('display', value);
    }
    public performing = false;

    getAvailablePoint() {
        const items = this.items.slice();
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

    items: RackItem[] = [];

    add(item: RackItem) {
        this.items.push(item);
    }

    remove(item: RackItem) {
        this.items = this.items.filter(i => i !== item);
    }

    save() {
        const str = this.serialize();
        console.log(str);
    }

    load() {
        console.log('Clearing items...');
        const serialized = this.serialize();
        this.items = [];
        // console.log('loading');
        const items = this.deserialize(serialized);
        console.log('Loaded', items);
    }

    perform() {
        this.performing = !this.performing;
        if (this.performing) {
            console.log('Started performance mode');
            Rack.emit('perform', true);
        } else {
            console.log('Stopped performance mode');
            Rack.emit('perform', false);
        }
        return this.performing;
    }

    serialize() {
        return JSON.stringify(this.items.map(i => i.serialize()));
    }

    deserialize(data: string) {
        const rackItems = JSON.parse(data) as SerializedRackItem[];
        if (!Array.isArray(rackItems)) throw new Error('Invalid data');
        if (rackItems.some(i => typeof i !== 'object'))
            throw new Error('Invalid data');
        this.items = [];

        const generated = rackItems.map(s => new RackItem(this, s));

        return generated;
    }

    // These are temporary methods to be used for testing purposes
    play() {}

    stop() {}
}
