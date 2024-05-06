<script lang="ts">
  import { Cable } from "../model/cable";
    import { IO, Input, Output } from "../model/io";
  import { colors } from "../model/rack-item";
    import { capitalize } from "../utils/text";

    export let io: IO;

    let color = colors[io.type];

    let active: Input|Output|null = Cable.state;

    Cable.on('change', (a) => active = a);


    const click = (io: Input | Output) => {
        if (Cable.state) {
            if (Cable.state instanceof Output && io instanceof Input) {
                Cable.state.connect(io);
            } else if (Cable.state instanceof Input && io instanceof Output) {
                io.connect(Cable.state);
            } else {
                console.log('Invalid connection');
            }
            Cable.state = null;
        } else {
            Cable.state = io;
        }
    }
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
                        on:click={() => click(i)}
                        class="text-light cursor-pointer"
                        style="background-color: {
                        color
                        .setAlpha(Object.is(active, i) ? 0.5 : 1)
                        .toString()
                        };"
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
                        on:click={() => click(o)}
                        class="text-light cursor-pointer"
                        style="background-color: {color
                            .setAlpha(Object.is(active, o) ? 0.5 : 1)
                        .toString()};"
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