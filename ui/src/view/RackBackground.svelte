<script lang="ts">
import { onMount } from 'svelte';
import { contextmenu } from '../utils/contextmenu';

export let x = 1;
export let y = 1;

let me: HTMLElement;

onMount(() => {
    contextmenu(
        [
            {
                name: 'New',
                action: () => {
                    console.log('new');
                },
                text: 'New',
                // class: 'fa fa-plus'
            },
        ],
        me
    );
});
</script>

<div class="position-absolute" bind:this="{me}">
    {#each Array.from({ length: y }) as _, yIndex}
        <div class="ws-nowrap">
            {#each Array.from({ length: x }) as _, xIndex}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="p-0 m-0"
                    width="16"
                    height="380"
                    ><path fill="#373737" d="M0 0h16v380H0z"></path><path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0 0h16v16H0V0zm12 8a4 4 0 11-8 0 4 4 0 018 0zM0 379v-16h16v16H0zm12-8a4 4 0 11-8 0 4 4 0 018 0z"
                        fill="#656565"
                    ></path></svg
                >
            {/each}
        </div>
    {/each}
</div>
