<script lang="ts">
    import { IO } from "../model/io";
  import { colors } from "../model/rack-item";
    import { Color } from "../utils/color";
    import { capitalize } from "../utils/text";

    export let io: IO;

    let color = colors[io.type];
</script>

<!-- {#each io.inputs as i, index}
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
{/each} -->

<div class="container-fluid">
    <div class="row">
        <div class="col-6">
            <div class="container-fluid">
                {#each io.inputs as i, index}
                <div class="d-flex justify-content-start">
                    <p
                        class="text-light"
                        style="background-color: {color.toString()};"
                    >
                        {capitalize(i.name)}
                    </p>
                </div>
                {/each}
            </div>
        </div>
        <div class="col-6">
            <div class="container-fluid">
                {#each io.outputs as o, index}
                <div class="d-flex justify-content-end">
                    <p
                        class="text-light"
                        style="background-color: {color.toString()};"
                    >
                        {capitalize(o.name)}
                    </p>
                </div>
                {/each}
            </div>
        </div>
    </div>
</div>


<style>
    p {
        font-size: 12px;
        margin: 5px 0px;
        padding: 2px 5px;
        width: min-content;
        white-space: nowrap;
    }

    .container-fluid, .row, .col-6 {
        padding: 0 !important;
        margin: 0 !important;
    }
</style>