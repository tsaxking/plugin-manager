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
import { sleep } from './utils/sleep';

const rack = new Rack();

new Index({
    target: document.body,
    props: {
        rack,
    },
});

let stop = () => {};
const FPS = 30;

const loop = (() => {
    let animating = false;
    const doLoop = (fn: () => void) => {
        const stop = () => (animating = false);
        if (animating) return stop;
        animating = true;
        const run = async () => {
            if (!animating) return;
            fn();
            await sleep(1000 / FPS);
            requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
        return stop;
    };
    return doLoop;
})();

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
            const prevX = parseFloat(target.getAttribute('data-x') || '0');
            const prevY = parseFloat(target.getAttribute('data-y') || '0');
            let x: number =
                // const x: number =
                parseFloat(target.getAttribute('data-x') || '0') + event.dx;
            let y: number =
                // const y: number =
                parseFloat(target.getAttribute('data-y') || '0') + event.dy;

            // for some reason, the y value jumps 380px on the last event
            // this is a hack to fix that
            // it could potentially cause bugs
            if (prevX - x > 50 || prevX - x < -50) {
                x = prevX;
            }

            if (prevY - y > 50 || prevY - y < -50) {
                y = prevY;
            }

            // target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', `${x}`);
            target.setAttribute('data-y', `${y}`);

            // const id = event.target.id.split('_')[1];
            // const item = rack.items.find(i => i.id === id);
            // if (item) {
            //     const cables = Cable.fromRackItem(item);
            //     for (const i in cables) {
            //         const c = cables[i];
            //         const delta = new Point(event.dx, event.dy);
            //         if (Object.is(c.input.rackItem, item)) {
            //             if (
            //                 cables.filter(
            //                     (_c, _i) =>
            //                         Object.is(_c.input.point, c.input.point) &&
            //                         _i > +i
            //                 ).length === 0
            //             ) {
            //                 c.input.point = c.input.point.add(delta);
            //             }
            //         }
            //         if (Object.is(c.output.rackItem, item)) {
            //             if (
            //                 cables.filter(
            //                     (_c, _i) =>
            //                         Object.is(
            //                             _c.output.point,
            //                             c.output.point
            //                         ) && _i > +i
            //                 ).length === 0
            //             ) {
            //                 c.output.point = c.output.point.add(delta);
            //             }
            //         }
            //         c.build();
            //     }
            //     Cable.view(rack.items, false);
            // }
        },
        end: event => {
            const target: HTMLDivElement = event.target;
            const id = target.id.split('_')[1];
            // console.log(id);
            // console.log(rack.items.map(c => c.id));
            const item = rack.items.find(i => i.id === id);
            if (item) {
                const startX = parseFloat(
                    target.getAttribute('data-start-x') || '0'
                );
                const startY = parseFloat(
                    target.getAttribute('data-start-y') || '0'
                );
                const dX = parseFloat(target.getAttribute('data-x') || '0');
                const dY = parseFloat(target.getAttribute('data-y') || '0');

                const centerX = startX + dX;
                const centerY = startY + dY;

                const dx2 = Math.round((centerX - startX) / 16);
                const dy2 = Math.round((centerY - startY) / 380);

                // console.log({
                //     dx2,
                //     dy2,
                //     centerX,
                //     centerY,
                //     startX,
                //     startY,
                //     dX,
                //     dY
                // });

                item.moveTo(item.x + dx2, item.y + dy2);
            } else {
                console.error('Item not found');
            }
            target.style.zIndex = target.getAttribute('data-z') || '0';
            target.setAttribute('data-x', '0');
            target.setAttribute('data-y', '0');

            target.style.transform = `translate(0px, 0px)`;
            Cable.view(rack.items, true);

            stop();
        },
        start: event => {
            const target: HTMLDivElement = event.target;
            const rect = target.getBoundingClientRect();
            target.setAttribute('data-z', target.style.zIndex);
            target.style.zIndex = '1000';

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const center = new Point(centerX, centerY);

            const id = event.target.id.split('_')[1];
            const item = rack.items.find(i => i.id === id);

            // let prev = new Point(centerX, centerY);
            stop = loop(() => {
                const dx = parseFloat(target.getAttribute('data-x') || '0');
                const dy = parseFloat(target.getAttribute('data-y') || '0');
                const delta = new Point(dx, dy);
                // prev = new Point(
                //     dx,
                //     dy
                // );

                target.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
                // const x = centerX + dx;
                // const y = centerY + dy;
                if (item) {
                    const cables = Cable.fromRackItem(item);
                    for (const i in cables) {
                        const c = cables[i];
                        if (Object.is(c.input.rackItem, item)) {
                            if (
                                cables.filter(
                                    (_c, _i) =>
                                        Object.is(
                                            _c.input.point,
                                            c.input.point
                                        ) && _i > +i
                                ).length === 0
                            ) {
                                c.input.point = c.input.update().add(delta);
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
                                c.output.point = c.output.update().add(delta);
                            }
                        }
                        c.build();
                    }
                }
            });
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
RackItem.on('destroy', () => Cable.view(rack.items, true));
Cable.view(rack.items, true);
