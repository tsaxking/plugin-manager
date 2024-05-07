<script lang="ts">
  import { RackItem } from "../model/rack-item";
    import FacePlate from "./RackItem.svelte";
import RackImage from "./RackBackground.svelte";
  import { onMount } from "svelte";
  import { Cable } from "../model/cable";
  import { Rack } from "../model/state";

  export let display: 'io' | 'control' = 'io';
  export let rack: Rack;

  $: Rack.display = display;

let items: RackItem[] = rack.items;

let cableTarget: HTMLDivElement;

onMount(() => {
    items = rack.items;
    Cable.setTarget(cableTarget);
});

RackItem.on('new', () => {
    items = rack.items;
});
</script>

<div class="position-relative" bind:this={cableTarget}>
    <RackImage x={200} y={3}/>

    {#each items as item}
        <FacePlate {item} bind:display={display}/>
    {/each}
</div>