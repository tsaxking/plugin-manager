import { Point2D } from '../utils/calcs/linear-algebra/point';
import { io } from './io';
import { RackItem } from './rack-item';

export class Rack {
    private static _display: 'io' | 'control' = 'io';
    public static get display() {
        return this._display;
    }
    public static set display(value: 'io' | 'control') {
        this._display = value;
        RackItem.emit('display', value);
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
            console.log('Start');
        } else {
            console.log('Stop');
        }
        return this.performing;
    }

    serialize() {
        return JSON.stringify(this.items.map(i => i.serialize()));
    }

    deserialize(data: string) {
        const items = JSON.parse(data) as unknown[];
        if (!Array.isArray(items)) throw new Error('Invalid data');
        if (items.some(i => typeof i !== 'object'))
            throw new Error('Invalid data');
        // if (items.some(i => (i as { id: string }).id)) throw new Error('Invalid data');
        const rackItems = items as {
            id: string;
            note: string;
            point: Point2D;
            width: number;
            color:
                | 'primary'
                | 'secondary'
                | 'success'
                | 'danger'
                | 'info'
                | 'dark'
                | 'warning';
            title: string;
            io: io;
            routing: {
                audio: string[];
                midi: string[];
                control: string[];
            };
        }[];

        this.items = [];

        const generated = rackItems.map(
            i =>
                new RackItem(
                    this,
                    i.id,
                    i.note,
                    i.point,
                    i.width,
                    i.color,
                    i.title,
                    i.io
                )
        );

        for (const g of generated) {
            const item = rackItems.find(i => i.id === g.id);
            if (!item) throw new Error('Invalid data'); // should never happen
            g.io.audio.deserialize(this, item.routing.audio);
            g.io.midi.deserialize(this, item.routing.midi);
            g.io.control.deserialize(this, item.routing.control);
        }

        return generated;
    }






    // These are temporary methods to be used for testing purposes
    play() {

    }

    stop() {

    }
}
