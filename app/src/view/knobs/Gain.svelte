<script lang="ts">
    import Knob from "./Knob.svelte";
    import { $Math as M } from '../../utils/math';

    export let gain = 0;

    let value = 0;

    $: gain = M.roundTo(1, value * (24 / 100));
</script>

<Knob bind:value={value} />