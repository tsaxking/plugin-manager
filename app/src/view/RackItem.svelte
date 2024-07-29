<script lang="ts">
import { onMount } from "svelte";
    import { RackItem } from "../model/rack-item";
import Fader from "./knobs/Fader.svelte";
import { contextmenu } from "../utils/contextmenu";
import Meter from "./Meter.svelte";
import { Stack } from "../utils/event-stack";

    export let item: RackItem;
    export let stack: Stack;

    let inputStream: AudioNode;
    let outputStream: AudioNode;
    let target: HTMLDivElement;

    const menus = () => {
        const off = contextmenu([
            {
                name: item.active ? 'Deactivate' : 'Activate',
                text: item.active ? 'Deactivate' : 'Activate',
                action: () => {
                    item.active = !item.active;
                    off();
                    menus();
                },
            },
            null,
            'Add/Remove',
            {
                name: 'Remove',
                text: 'Remove',
                action: () => {
                    // item.remove();
                },
            },
            {
                name: 'Insert Before',
                text: 'Insert Before',
                action: () => {
                    // item.insertBefore();
                },
            },
            {
                name: 'Insert After',
                text: 'Insert After',
                action: () => {
                    // item.insertAfter();
                },
            },
        ], target);
    }

    const init = async () => {
        [inputStream, outputStream] = (await item.getIOStream()).unwrap();
    };
    
    
    onMount(() => {
        // init();
        menus();
    });
</script>

<div class="rack-item py-1"
    class:bg-secondary={!item.active}
    bind:this={target}
>
    <!-- <Meter bind:audio={inputStream}/> -->
    <Fader bind:fader={item.inputGain} {stack}/>
    <p>
        {item.name}
    </p>
    <Fader bind:fader={item.outputGain} {stack}/>
    <!-- <Meter bind:audio={outputStream}/> -->
</div>