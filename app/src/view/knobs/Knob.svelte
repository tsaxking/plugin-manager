<script lang="ts">
import { onMount } from 'svelte';
import { Color } from '../../utils/color';
import { Stack } from '../../utils/event-stack';
export let value = 0;

export let stack: Stack;

const primary = Color.fromBootstrap('primary').toString('rgb');
const dark = Color.fromName('black').toString('rgb');

let input: HTMLInputElement;
let prev: number;
let redo: number;
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

<input
    bind:this={input}
    type="range"
    class="input-knob circle"
    bind:value
    data-bgcolor="{dark}"
    data-fgcolor="{primary}"
    data-diameter="35"
/>
