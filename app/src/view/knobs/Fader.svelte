<script lang="ts">
import { onMount } from 'svelte';
import { Color } from '../../utils/color';
export let fader = 0;
import { Stack } from '../../utils/event-stack';

export let stack: Stack;
export let vertical = true;

let value = (() => {
    switch (true) {
        case fader === -Infinity:
            return 0;
        case fader < 0:
            // -60db to 0db
            return Math.round(((fader + 60) / 60) * 60);
        case fader === 0:
            return 60;
        case fader < 10:
            // 0db to 10db
            return Math.round((fader * 20) / 10 + 60);
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
        case value < 60:
            // -60db to 0db
            fader = Math.round(-60 + (value / 60) * 60);
            break;
        case value === 60:
            fader = 0;
            break;
        case value < 100:
            // 0db to 10db
            fader = Math.round(((value - 60) * 10) / 20);
            break;
    }
}


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

<div class="w-100">
    <div class="fader">
    {#if vertical}
        <input
        type="range"
        class="fader input-slider"
        data-src="../src/images/fader_knob.png"
        data-sprites="200"
        data-width=30
        data-height=150
        bind:value
        bind:this={input}
        />
        {:else} 
        <input
        type="range"
        class="fader input-slider"
        data-width=150
        data-fgcolor="#0f14f0"
        data-height=12
        bind:value
        bind:this={input}
        />
        {/if}
    </div>

    <p class="
    p-0
    ws-nowrap
    w-100
    text-center
    ">
        {
            fader === -Infinity
                ? '-∞'
                : fader
    } db
    </p>
</div>

<style>
    .fader {
        /* margin: 0 auto; */
        /* box-sizing: border-box; */
        display: flex;
        justify-content: center;
        /* flex-direction: row; */
        /* align-items: center; */
    }
</style>
