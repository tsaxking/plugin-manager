<script lang="ts">
  import { RackItem } from "../model/rack-item";
    import FacePlate from "./RackItem.svelte";
import RackImage from "./RackBackground.svelte";
  import { onMount } from "svelte";

let items: RackItem[] = RackItem.items;

onMount(() => {
    items = RackItem.items;
});

RackItem.on('new', () => {
    items = RackItem.items;
});
</script>

<RackImage x={200} y={3}/>

{#each items as item}
    <FacePlate {item} />
{/each}