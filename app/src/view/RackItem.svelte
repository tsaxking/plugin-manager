<script lang="ts">
import { RackItem } from '../model/rack-item';
import IO from './IO.svelte';

type BootstrapColor =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'info'
    | 'dark'
    | 'warning';

export let item: RackItem;
export let display: 'io' | 'control' = 'io';

let title = item.title;
let note = item.note;
let color: BootstrapColor = item.color;
let x = item.x;
let y = item.y;
let units = item.width;

type Drag = (e: DragEvent) => void;

export let dragstart: Drag = e => {
    console.log('dragging');
};
export let dragover: Drag = e => {
    console.log('dragging over');
};
export let drop: Drag = e => {
    console.log('dropped');
};

let textColor: 'light' | 'dark' = (() => {
    switch (color) {
        case 'primary':
        case 'secondary':
        case 'success':
        case 'danger':
        case 'warning':
        case 'info':
        case 'dark':
            return 'light';
        default:
            return 'dark';
    }
})();

item.on('move', ({ x: X, y: Y }) => {
    console.log('move', X, Y);
    x: x = X;
    y = Y;
});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    id="ri_{item.id}"
    draggable
    class="rack-item"
    style="
        top: {y * 380}px; 
        left: {x * 16}px; 
        background-color: var(--bs-{color});
        height: 380px;
        width: {units * 16}px;
        color: var(--bs-{textColor});
    "
>
    {#if title}
        <h1>{title}</h1>
        <small>{note}</small>
    {/if}
    {#if display === 'io'}
        <div class="io position-relative">
            <!-- <div class="d-flex justify-content-between">
                <p>
                    Input
                </p>
                <p>
                    Output
                </p>
            </div> -->
            <IO io="{item.io.audio}" />
            <IO io="{item.io.midi}" />
            <IO io="{item.io.control}" />
        </div>
    {:else if display === 'control'}
        <slot />
    {/if}
    <slot />
    {#each [1, 2, 3, 4] as index}
        <svg
            class="{`screw-${index}`}"
            width="12"
            height="12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 12A6 6 0 106 0a6 6 0 000 12zm5-6A5 5 0 111 6a5 5 0 0110 0zM4 4.667L4.667 4 6 5.333 7.333 4 8 4.667 6.667 6
                        8 7.333 7.333 8 6 6.667 4.667 8 4 7.333 5.333 6 4 4.667z"
                fill="currentColor"
            ></path>
        </svg>
    {/each}
</div>

<style>
.rack-item {
    width: 100%;
    height: 100%;
    position: absolute;
}

h1,
svg {
    pointer-events: none;
}

h1 {
    /* font-family: 'Routed Gothic Wide'; */
    font-size: 14px;
    line-height: 14px;
    position: absolute;
    text-align: center;
    top: 24px;
    width: 100%;
}

small {
    line-height: 14px;
    position: absolute;
    text-align: center;
    top: 42px;
    width: 100%;
}

svg {
    position: absolute;
    opacity: 0.4;
}

.screw-1,
.screw-2 {
    top: 2px;
}

.screw-3,
.screw-4 {
    bottom: 3px;
}

.screw-1,
.screw-3 {
    left: 2px;
}

.screw-2,
.screw-4 {
    right: 2px;
}

.io {
    position: absolute;
    top: 60px;
}
</style>
