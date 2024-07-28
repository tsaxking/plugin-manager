<script lang="ts">
import Channel from './Channel.svelte';
</script>



<div class="mixer no-scroll-y">
    <Channel name="Channel 1" />
    <Channel name="Channel 2" />
    <Channel name="Channel 3" />
    <Channel name="Channel 4" />
    <Channel name="Channel 5" />
</div>


<style>
    .mixer {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: calc(100vh - var(--navbar-height));
    }
</style>