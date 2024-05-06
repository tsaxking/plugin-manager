// import './styles/animate.css';
import './styles/global.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.css';


import './styles/style.css';

import Index from './view/Index.svelte';


// import '@interactjs/auto-start'
// import '@interactjs/actions/drag'
// import '@interactjs/actions/resize'
// import '@interactjs/modifiers'
// import '@interactjs/dev-tools'
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
                console.log('moving', dx, dy, x, y);
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