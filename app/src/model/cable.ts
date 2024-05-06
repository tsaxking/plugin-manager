import { getCatenaryPathSVG } from "../utils/calcs/linear-algebra/catenary";
import { Input, Output } from "./io";
import { RackItem } from "./rack-item";
import { colors } from "./rack-item";

export class Cable {
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
        const cables = Cable.generate(RackItem.items);
        for (const c of cables) document.body.appendChild(c.build());
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
        const pathStr = getCatenaryPathSVG(this.input.point, this.output.point, .6);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathStr);
        path.style.stroke = colors[this.type].toString();
        path.style.strokeWidth = '5';
        path.style.fill = 'none';
        this.svg.appendChild(path);
        return this.svg;
    }
}