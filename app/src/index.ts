import { Random } from './utils/math';
import { Cable } from './model/cable';
import { Processors } from './model/items/processors';
import { IO } from './model/io';
// import './styles/animate.css';
import './styles/global.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.css';

import './styles/style.css';

import Index from './view/Index.svelte';

import interact from 'interactjs';
import { RackItem } from './model/rack-item';
import { Point } from './utils/calcs/linear-algebra/point';
import { Rack } from './model/state';

const rack = new Rack();

new Index({
    target: document.body,
    props: {
        rack,
    },
});

interact('.rack-item').draggable({
    // inertia: true,
    modifiers: [
        interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true,
        }),
    ],
    autoScroll: true,
    listeners: {
        move: event => {
            const target: HTMLDivElement = event.target;
            const x =
                parseFloat(target.getAttribute('data-x') || '0') + event.dx;
            const y =
                parseFloat(target.getAttribute('data-y') || '0') + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', `${x}`);
            target.setAttribute('data-y', `${y}`);

            const id = event.target.id.split('-')[1];
            const item = rack.items.find(i => i.id === id);
            if (item) {
                const cables = item.cables;
                for (const i in cables) {
                    const c = cables[i];
                    const delta = new Point(event.dx, event.dy);
                    if (Object.is(c.input.rackItem, item)) {
                        if (
                            cables.filter(
                                (_c, _i) =>
                                    Object.is(_c.input.point, c.input.point) &&
                                    _i > +i
                            ).length === 0
                        ) {
                            c.input.point = c.input.point.add(delta);
                        }
                    }
                    if (Object.is(c.output.rackItem, item)) {
                        if (
                            cables.filter(
                                (_c, _i) =>
                                    Object.is(
                                        _c.output.point,
                                        c.output.point
                                    ) && _i > +i
                            ).length === 0
                        ) {
                            c.output.point = c.output.point.add(delta);
                        }
                    }
                    c.build();
                }
                Cable.view(rack.items, false);
            }
        },
        end: event => {
            const target: HTMLDivElement = event.target;
            const id = target.id.split('-')[1];
            const item = rack.items.find(i => i.id === id);
            if (item) {
                const dx =
                    parseFloat(target.getAttribute('data-x') || '0') / 16;
                const dy =
                    parseFloat(target.getAttribute('data-y') || '0') / 380 + 1;
                const { x, y } = item;
                item.moveTo(Math.floor(x + dx), Math.floor(y + dy));
            }
            target.style.zIndex = target.getAttribute('data-z') || '0';
            target.setAttribute('data-x', '0');
            target.setAttribute('data-y', '0');

            target.style.transform = `translate(0px, 0px)`;
        },
        start: event => {
            const target: HTMLDivElement = event.target;
            target.setAttribute('data-z', target.style.zIndex);
            target.style.zIndex = '1000';

            target.setAttribute('data-x', '0');
            target.setAttribute('data-y', '0');
        },
    },
});

const midiInput = Processors.instrument(
    rack,
    Random.uuid(),
    'Keystation 88 Pro',
    ['MIDI In'],
    ['MIDI Out']
);

const controller = Processors.midiController(
    rack,
    Random.uuid(),
    'ASDR',
    ['MIDI In'],
    ['Volume', 'Pitch', 'Modulation']
);

const oscillator = Processors.oscillator(rack, Random.uuid(), 'Sine', [
    'Volume',
    'Pitch',
    'Modulation',
]);

const compressor = Processors.compressor(rack, Random.uuid(), 'Compressor');

const reverb = Processors.reverb(rack, Random.uuid(), 'Concert Hall', true);

const output = Processors.audioOutput(
    rack,
    Random.uuid(),
    'UMC 1820',
    Array.from({ length: 10 }, (_, i) => `${i + 1}`)
);

output.moveTo(60, 0);
reverb.moveTo(48, 0);
compressor.moveTo(32, 0);
oscillator.moveTo(22, 1);
controller.moveTo(9, 1);

midiInput.io.midi.outputs[0].connect(controller.io.midi.inputs[0]);
controller.io.control.outputs[0].connect(oscillator.io.control.inputs[0]);
controller.io.control.outputs[1].connect(oscillator.io.control.inputs[1]);
controller.io.control.outputs[2].connect(oscillator.io.control.inputs[2]);
oscillator.io.audio.outputs[0].connect(compressor.io.audio.inputs[0]);
compressor.io.audio.outputs[0].connect(reverb.io.audio.inputs[0]);
reverb.io.audio.outputs[0].connect(output.io.audio.inputs[0]);
reverb.io.audio.outputs[1].connect(output.io.audio.inputs[1]);

IO.on('change', () => Cable.view(rack.items, true));
RackItem.on('display', () => Cable.view(rack.items, true));
RackItem.on('move', () => Cable.view(rack.items, true));
Cable.view(rack.items, true);
