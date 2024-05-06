<script lang="ts">
    import { IO } from "../model/io";
    import { Color } from "../utils/color";
  import { capitalize } from "../utils/text";

    export let io: IO;

    let color = (() => {
        switch (io.type) {
            case 'audio':
                return Color.fromName('blue').setAlpha(0.5);
            case 'midi':
                return Color.fromName('green').setAlpha(0.5);
            case 'cv':
                return Color.fromName('red').setAlpha(0.5);
        }
    })();
</script>

{#each io.inputs as i, index}
    <div class="d-flex w-100 justify-content-start">
        {#if !!i}
            <p
                class="text-light px-1"
                style="background-color: {color.toString()};"
            >
                {capitalize(i.type)} {index + 1}
            </p>
        {/if}
    </div>
{/each}
{#each io.outputs as o, index}
    <div class="d-flex w-100 justify-content-end">
        {#if !!o}
            <p
                class="text-light px-1"
                style="background-color: {color.toString()};"
            >
                {capitalize(o.type)} {index + 1}
            </p>
        {/if}
    </div>
{/each}


<style>
    p {
        font-size: 12px;
    }
</style>