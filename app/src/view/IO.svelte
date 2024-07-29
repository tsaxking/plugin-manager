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
                            <input class="checkbox" type="checkbox" checked={input === i} on:change={async (e) => {
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
                        </td>
                    {/each}
                {:else}
                    {#each outputs as o}
                        <td>
                            <input class="checkbox" type="checkbox" checked={output === o} on:change={async (e) => {
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
                        </td>
                    {/each}
                {/if}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    .checkbox {
        width: 50px !important;
        height: 50px !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
    }

    .checkbox:checked {
        /* background-color: var(--primary) !important; */
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