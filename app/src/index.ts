
import { Random } from "./utils/math";
import { Cable } from "./model/cable";
import { Instrument } from "./model/items/processors/instrument";
import { Controller } from "./model/items/processors/midi-controller";
import { Oscillator } from "./model/items/processors/oscillator";
import { Compressor } from "./model/items/processors/compressor";
import { Reverb } from "./model/items/processors/reverb";
  import { AudioOutput } from "./model/items/processors/audio-output";
  import { IO } from './model/io';
// import './styles/animate.css';
import './styles/global.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.css';


import './styles/style.css';

import Index from './view/Index.svelte';


import interact from 'interactjs';
import { RackItem } from './model/rack-item';

new Index({
    target: document.body
});

interact('.rack-item').draggable({
    // inertia: true,
    modifiers: [
        interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
        })
    ],
    autoScroll: true,
    listeners: {
        move: (event) => {
            const target: HTMLDivElement = event.target;
            const x = (parseFloat((target.getAttribute('data-x')) || '0')) + event.dx;
            const y = (parseFloat((target.getAttribute('data-y')) || '0')) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', `${x}`);
            target.setAttribute('data-y', `${y}`);
        },
        end: (event) => {
            const target: HTMLDivElement = event.target;
            const id = target.id.split('-')[1];
            const item = RackItem.items.find(i => i.id === id);
            if (item) {
                const dx = parseFloat((target.getAttribute('data-x')) || '0') / 16;
                const dy = parseFloat((target.getAttribute('data-y')) || '0') / 380 + 1;
                const { x, y } = item;
                item.moveTo(Math.floor(x + dx), Math.floor(y + dy));
            }
            target.style.zIndex = target.getAttribute('data-z') || '0';
            target.setAttribute('data-x', '0');
            target.setAttribute('data-y', '0');

            target.style.transform = `translate(0px, 0px)`;

        },
        start: (event) => {
            const target: HTMLDivElement = event.target;
            target.setAttribute('data-z', target.style.zIndex);
            target.style.zIndex = '1000';

            target.setAttribute('data-x', '0');
            target.setAttribute('data-y', '0');
        }
    }
});

const midiInput = new Instrument(
    Random.uuid(),
    'Keystation 88 Pro',
    ['MIDI In'],
    ['MIDI Out'],
);

const controller = new Controller(
    Random.uuid(),
    'ASDR',
    ['MIDI In'],
    ['Volume', 'Pitch', 'Modulation'],
);

const oscillator = new Oscillator(
    Random.uuid(),
    'Sine',
    ['Volume', 'Pitch', 'Modulation']
);

const compressor = new Compressor(
    Random.uuid(),
    'Compressor',
);

const reverb = new Reverb(
    Random.uuid(),
    'Concert Hall',
);

const output = new AudioOutput(
    Random.uuid(),
    'Main Out',
    ['Left', 'Right'],
);

output.moveTo(60, 0);
reverb.moveTo(48, 0);
compressor.moveTo(32, 0);
oscillator.moveTo(22, 1);
controller.moveTo(9, 1);

IO.on('change', Cable.view);
RackItem.on('move', Cable.view);

midiInput.io.midi.outputs[0].connect(controller.io.midi.inputs[0]);
controller.io.control.outputs[0].connect(oscillator.io.control.inputs[0]);
controller.io.control.outputs[1].connect(oscillator.io.control.inputs[1]);
controller.io.control.outputs[2].connect(oscillator.io.control.inputs[2]);
oscillator.io.audio.outputs[0].connect(compressor.io.audio.inputs[0]);
compressor.io.audio.outputs[0].connect(reverb.io.audio.inputs[0]);
reverb.io.audio.outputs[0].connect(output.io.audio.inputs[0]);
reverb.io.audio.outputs[1].connect(output.io.audio.inputs[1]);