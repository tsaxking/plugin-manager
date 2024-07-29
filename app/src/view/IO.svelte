<script lang="ts">
import { onMount } from "svelte";
    import { Channel } from "../model/channel";
import { AudioInput, AudioIO, AudioOutput } from "../model/io";
import { resolveAll, attemptAsync } from '../utils/check';
import { alert } from '../utils/prompt';
import { Stack } from '../utils/event-stack';

export let stack: Stack;

    let channels: {
        channel: Channel;
        input?: AudioInput;
        output?: AudioOutput
    }[] = [];
    let inputs: AudioInput[] = [];
    let outputs: AudioOutput[] = [];

    let view = 'inputs';

    $: {
        console.log(view);
        stack.clear();
    }

    onMount(() => {
        Channel.getChannels().then(async c => {
            channels = resolveAll(await Promise.all(c.unwrap().map(channel => {
                return attemptAsync(async () => {
                    const input = await channel.getInput();
                    const output = await channel.getOutput();
                    return { channel, input: input.unwrap(), output: output.unwrap() };
                });
            }))).unwrap();
        });
        AudioIO.getInputs().then(i => inputs = i.unwrap());
        AudioIO.getOutputs().then(o => outputs = o.unwrap());
    });

    // TODO: patch 1:1 button
</script>


<div class="btn-group" role="group">
    <button class="btn btn-primary"
        disabled={view === 'inputs'}
        on:click={() => view = 'inputs'}
    >
    Inputs
    </button>
    <button class="btn btn-primary"
        disabled={view === 'outputs'}
        on:click={() => view = 'outputs'}
    >Outputs</button>
    </div>
<table>
    <thead>
        <tr>
            <th></th>
            {#if view === 'inputs'}
                {#each inputs as input}
                    <th class="ws-nowrap"><div>{input.name}</div></th>
                {/each}
            {:else}
                {#each outputs as output}
                    <th class="ws-nowrap"><div>{output.name}</div></th>
                {/each}
            {/if}
        </tr>
    </thead>
    <tbody>
        {#each channels as { channel, input, output }}
            <tr>
                <th>
                    <p class="ws-nowrap">{channel.name}</p>
                </th>
                {#if view === 'inputs'}
                    {#each inputs as i}
                        <td>
                            <label
                                title="Route {i.name} to {channel.name}"
                            for="ch-{channel.name}-to-input-{i.id}" class="checkbox">
                            <input name="ch-{channel.name}-to-input-{i.id}" class="checkbox" type="checkbox" checked={input === i} on:change={async (e) => {
                                const el = e.currentTarget;
                                if (el.checked) {
                                    const res = await i.use(channel);
                                    if (res.isErr()) {
                                        alert(res.error.message);
                                        return el.checked = false;
                                    }

                                    stack.push({
                                        name: 'Input change',
                                        undo: () => {
                                            i.release();
                                            el.checked = false;
                                        },
                                        redo: () => {
                                            i.use(channel);
                                            el.checked = true;
                                        },
                                    });
                                } else {
                                    i.release();
                                    stack.push({
                                        name: 'Input change',
                                        undo: () => {
                                            i.use(channel);
                                            el.checked = true;
                                        },
                                        redo: () => {
                                            i.release();
                                            el.checked = false;
                                        },
                                    });
                                }
                            }}/>
                            <span class="checkmark"></span>
                            </label>
                        </td>
                    {/each}
                {:else}
                    {#each outputs as o}
                        <td>
                            <label
                                title="Route {channel.name} to {o.name}"
                            for="ch-{channel.name}-to-output-{o.id}" class="checkbox">
                            <input name="ch-{channel.name}-to-output-{o.id}" class="checkbox" type="checkbox" checked={output === o} on:change={async (e) => {
                                const el = e.currentTarget;
                                if (el.checked) {
                                    const res = await o.use(channel);
                                    if (res.isErr()) {
                                        alert(res.error.message);
                                        return el.checked = false;
                                    }
                                    stack.push({
                                        name: 'Output change',
                                        undo: () => {
                                            o.release();
                                            el.checked = false;
                                        },
                                        redo: () => {
                                            o.use(channel);
                                            el.checked = true;
                                        },
                                    })
                                } else {
                                    o.release();
                                    stack.push({
                                        name: 'Output change',
                                        undo: () => {
                                            o.use(channel);
                                            el.checked = true;
                                        },
                                        redo: () => {
                                            o.release();
                                            el.checked = false;
                                        },
                                    });
                                }
                            }}/>
                            <span class="checkmark"></span>
                            </label>
                        </td>
                    {/each}
                {/if}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    .checkbox input {
        /* opacity: 0; */
        /* height: 0 !important; */
        /* width: 0 !important; */
        border-radius: 0px;
    }   

    .checkbox {
        display: block;
        position: relative;
        border: var(--bs-secondary) solid 1px !important;
        user-select: none;
        height: 50px !important;
        width: 50px !important;
    }

    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--bs-secondary) !important;
    } 

    .checkbox:hover input ~ .checkmark {
        background-color: var(--bs-secondary) !important;
    }

    .checkbox input:checked ~ .checkmark {
        background-color: var(--bs-secondary) !important;
    }

    .checkbox:checked {
        background-color: var(--bs-secondary) !important;
    }

    tr {
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
    }

    thead tr th, td {
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        max-width: 50px !important;
        max-height: 50px !important;
    }

    thead tr th {
        overflow: hidden !important;
        text-overflow: ellipsis !important;
    }
</style>