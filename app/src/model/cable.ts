import { getCatenaryPathSVG } from "../utils/calcs/linear-algebra/catenary";
import { Input, Output } from "./io";
import { RackItem } from "./rack-item";
import { colors } from "./rack-item";
import { EventEmitter } from "../utils/event-emitter";
import { Rack } from "./state";



type Events = {
    change: Input|Output|null;
}

export class Cable {
    public static all: Cable[] = [];

    private static _state: Input|Output|null = null;
    public static get state() { return Cable._state; }
    public static set state(value: Input|Output|null) {
        Cable._state = value;
        Cable.emit('change', value);
    }

    private static readonly target = document.createElement('div');

    private static readonly emitter = new EventEmitter<keyof Events>();

    public static on<T extends keyof Events>(event: T, listener: (arg: Events[T]) => void) {
        Cable.emitter.on(event, listener);
    }

    public static off<T extends keyof Events>(event: T, listener: (arg: Events[T]) => void) {
        Cable.emitter.off(event, listener);
    }

    public static emit<T extends keyof Events>(event: T, arg: Events[T]) {
        Cable.emitter.emit(event, arg);
    }
    
    // public static readonly cables: Cable[] = [];

    public static generate(rackItems: RackItem[]) {
        const io = rackItems.flatMap(i => [i.io.midi, i.io.audio, i.io.control]);
        const inputs = io.flatMap(i => i.outputs);
        return inputs.flatMap(o => {
            return o.connections.map(c => {
                return new Cable(c,o, o.type);
            });
        });
    }

    public static view(rackItems: RackItem[], update: boolean) {
        Cable.target.innerHTML = '';
        Cable.all = [];
        if (Rack.display === 'control') return;
        const cables = Cable.generate(rackItems);
        if (update) {
            for (const c of cables) {
                c.input.update();
                c.output.update();
            }
        }
        for (const c of cables) Cable.target.appendChild(c.build());
    }

    public static setTarget(target: HTMLDivElement) {
        Cable.target.style.position = 'relative';
        Cable.target.style.height = '100%';
        Cable.target.style.width = '100%';
        Cable.target.style.pointerEvents = 'none';
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.height = '100vh';
        div.style.width = '100vw';
        div.style.pointerEvents = 'none';
        div.appendChild(Cable.target);
        target.appendChild(div);
    }


    public readonly svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    constructor(
        public readonly input: Input,
        public readonly output: Output,
        public readonly type: 'midi' | 'audio' | 'control') {
        this.svg.style.position = 'absolute';
        this.svg.style.zIndex = '1000';
        this.svg.style.height = '100%';
        this.svg.style.width = '100%';
        this.svg.style.filter = 'drop-shadow(0px 0px 5px rgba(0,0,0,0.5))';

        Cable.all.push(this);
    }

    build() {
        this.svg.innerHTML = ''; // clear the svg
        const pathStr = getCatenaryPathSVG(this.input.point, this.output.point, .75);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathStr);
        path.style.stroke = colors[this.type].toString();
        path.style.strokeWidth = '5';
        path.style.fill = 'none';
        this.svg.appendChild(path);
        return this.svg;
    }
}