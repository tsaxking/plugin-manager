<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte';
import { alert, select } from '../utils/prompt';
import { AudioInput, AudioOutput, AudioIO } from '../model/io';
import { attemptAsync } from '../utils/check';
import { abbreviate } from '../utils/text';
import { Channel } from '../model/channel';
export let channel: Channel;

let input: AudioInput | undefined;
let output: AudioOutput | undefined;

const init = async () =>
    (
        await attemptAsync(async () => {
            input = (await channel.getInput()).unwrap();
            output = (await channel.getOutput()).unwrap();
        })
    ).unwrap();

const getInput = async () => {
    const res = await attemptAsync(async () => {
        const inputs = (await AudioIO.getAvailableInputs()).unwrap();
        const selected = await select(
            'Select an input',
            inputs.map(i => i.name),
            {
                defaultSelected: inputs.findIndex(i => i.id === input?.id),
                defaultMessage: 'Select Input',
            }
        );
        console.log(selected);
        if (selected !== null) {
            input?.release();
            input = inputs[selected];
            (await input.use(channel)).unwrap();
        }
    });
    if (res.isErr()) {
        alert(res.error.message);
    }
    init();
};

const getOutput = async () => {
    const res = await attemptAsync(async () => {
        const outputs = (await AudioIO.getAvailableOutputs()).unwrap();
        const selected = await select(
            'Select an output',
            outputs.map(o => o.name),
            {
                defaultSelected: outputs.findIndex(o => o.id === output?.id),
                defaultMessage: 'Select Output',
            }
        );
        if (selected !== null) {
            output?.release();
            output = outputs[selected];
            (await output.use(channel)).unwrap();
        }
    });
    if (res.isErr()) {
        alert(res.error.message);
    }
    init();
};

onMount(() => {
    init();
});
</script>

<div class="io">
    <div class="io__input">
        <button
            on:click="{getInput}"
            class="btn btn-secondary w-100 border-0 rounded-0 ws-nowrap p-0"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-title="{input?.name || 'No Input'}"
            >{abbreviate(input?.name || 'Select Input', 12)}</button
        >
    </div>
    <div class="io__output">
        <button
            on:click="{getOutput}"
            class="btn btn-secondary w-100 border-0 rounded-0 ws-nowrap p-0"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-title="{output?.name || 'No Output'}"
            >{abbreviate(output?.name || 'Select Output', 13)}</button
        >
    </div>
</div>

<style>
.io {
    /* display: flex; */
    /* justify-content: space-between; */
    /* align-items: center; */
    width: 100%;
    /* height: 100%; */
}

.io__output,
.io__input {
    /* display: flex; */
    /* justify-content: center; */
    /* align-items: center; */
    width: 100%;
    height: 100%;
}
</style>
