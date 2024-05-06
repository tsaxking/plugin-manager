import { getCatenaryPathSVG } from "../utils/calcs/linear-algebra/catenary";
import { Input, Output } from "./io";
import { RackItem } from "./rack-item";
import { colors } from "./rack-item";
import { EventEmitter } from "../utils/event-emitter";

const cablesDiv = document.createElement('div');
cablesDiv.style.position = 'fixed';
cablesDiv.style.zIndex = '1000';
cablesDiv.style.height = '100%';
cablesDiv.style.width = '100%';
cablesDiv.style.pointerEvents = 'none';
document.body.appendChild(cablesDiv);

type Events = {
    change: Input|Output|null;
}

export class Cable {
    private static _state: Input|Output|null = null;
    public static get state() { return Cable._state; }
    public static set state(value: Input|Output|null) {
        Cable._state = value;
        Cable.emit('change', value);
    }

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

    public static view() {
        cablesDiv.innerHTML = '';
        const cables = Cable.generate(RackItem.items);
        for (const c of cables) cablesDiv.appendChild(c.build());
    }


    public readonly svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    constructor(
        public readonly input: Input,
        public readonly output: Output,
        public readonly type: 'midi' | 'audio' | 'control') {
        this.svg.style.position = 'fixed';
        this.svg.style.zIndex = '1000';
        this.svg.style.height = '100%';
        this.svg.style.width = '100%';
        this.svg.style.filter = 'drop-shadow(0px 0px 5px rgba(0,0,0,0.5))';
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