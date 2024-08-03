<script lang="ts">
import Channel from './Channel.svelte';
import { Channel as C } from '../model/channel';
import { onMount } from 'svelte';
import { Stack } from '../utils/event-stack';

export let stack: Stack;

let channels: C[] = [];

onMount(() => {
    C.getChannels().then(c => channels = c.unwrap());
});
</script>

<div class="mixer no-scroll-y">
    {#each channels as channel}
        <Channel {channel} {stack} />
    {/each}
</div>

<style>
.mixer {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: calc(100vh - var(--navbar-height));
}
</style>
