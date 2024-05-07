<script lang="ts">
  import { RackItem } from "../model/rack-item";
    import FacePlate from "./RackItem.svelte";
import RackImage from "./RackBackground.svelte";
  import { onMount } from "svelte";
  import { Cable } from "../model/cable";

  export let display: 'io' | 'control' = 'io';

let items: RackItem[] = RackItem.items;

let cableTarget: HTMLDivElement;

onMount(() => {
    items = RackItem.items;
    Cable.setTarget(cableTarget);
});

RackItem.on('new', () => {
    items = RackItem.items;
});
</script>

<div class="position-relative">
    <div class="position-absolute" 
        class:d-none={display !== 'io'}
    bind:this={cableTarget}></div>
    <RackImage x={200} y={3}/>

    {#each items as item}
        <FacePlate {item} bind:display={display}/>
    {/each}
</div>