<script lang="ts">
import { onMount } from 'svelte';
import { Color } from '../../utils/color';
export let fader = 0;
import { Stack } from '../../utils/event-stack';

export let stack: Stack;

let value = (() => {
    switch (true) {
        case fader === -Infinity:
            return 0;
        case fader < 0:
            // -60db to 0db
            return Math.round(((fader + 60) / 60) * 80);
        case fader === 0:
            return 80;
        case fader < 10:
            // 0db to 10db
            return Math.round((fader * 20) / 10 + 80);
        default:
            return 100;
    }
})();

let prev: number;
let redo: number;

$: {
    switch (true) {
        case value === 0:
            fader = -Infinity;
            break;
        case value < 80:
            // -60db to 0db
            fader = Math.round(-60 + (value / 80) * 60);
            break;
        case value === 80:
            fader = 0;
            break;
        case value < 100:
            // 0db to 10db
            fader = Math.round(((value - 80) * 10) / 20);
            break;
    }
}

const primary = Color.fromBootstrap('primary').toString('rgb');
const dark = Color.fromName('black').toString('rgb');

let input: HTMLInputElement;

onMount(() => {
    const mousedown = () => {
        prev = value;
        document.addEventListener('mouseup', mouseup);
    };

    const mouseup = () => {
        document.removeEventListener('mouseup', mouseup);
        stack.push({
            name: 'Fader change',
            undo: () => {
                redo = value;
                value = prev;
            },
            redo: () => value = redo,
        });
        input.addEventListener('mousedown', mousedown);
    };

    input.addEventListener('mousedown', mousedown);

    return () => {
        document.removeEventListener('mouseup', mouseup);
        input.removeEventListener('mousedown', mousedown);
    };
});
</script>

<div class="fader">
    <input
    type="range"
    class="input-slider"
    data-width=150
    data-height=10
    bind:value
    data-bgcolor="{dark}"
    data-fgcolor="{primary}"
    bind:this={input}
    />

    <p class="
    p-0
    m-0
    ws-nowrap">
        {
            fader === -Infinity
                ? '-∞'
                : fader
    } db
    </p>
</div>

<style>
    .fader {
        /* box-sizing: border-box; */
        /* display: flex; */
        /* justify-content: space-between; */
        /* flex-direction: row; */
        /* align-items: center; */
    }
</style>
