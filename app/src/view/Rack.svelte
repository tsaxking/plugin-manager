<script lang="ts">
import { RackItem } from '../model/rack-item';
import FacePlate from './RackItem.svelte';
import RackImage from './RackBackground.svelte';
import { onMount } from 'svelte';
import { Cable } from '../model/cable';
import { Rack } from '../model/state';

export let display: 'io' | 'control' = 'io';
export let rack: Rack;

$: Rack.display = display;

let items: RackItem[] = [];

$: console.log(items);

let cableTarget: HTMLDivElement;

onMount(() => {
    Cable.setTarget(cableTarget);
});

RackItem.on('new', () => {
    items = rack.items;
});
RackItem.on('destroy', () => {
    items = rack.items;
});
</script>

<div class="position-relative" bind:this="{cableTarget}">
    <RackImage x="{200}" y="{3}" />

    <!-- {#if items.length} -->
        {#each items as item}
            <FacePlate bind:item={item} bind:display={display} />
        {/each}
    <!-- {/if} -->
</div>
