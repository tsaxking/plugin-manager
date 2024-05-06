<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const d = createEventDispatcher();

    export let tabs: string[] = [];
    export let active: string | null = tabs[0];

    $: d('change', active);
</script>

<ul class="nav nav-tabs">
    {#each tabs as tab}
    <li class="nav-item">
        <a
            href="#{tab}"
            class:active={tab === active}
            class="nav-link px-2 py-1 text-light"
            on:click={() => active = tab}
        >{tab}</a>
        </li>
    {/each}
</ul>

<style>
    ul {
        z-index: 1;
    }
</style>