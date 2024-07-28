<script lang="ts">
    import Knob from "./Knob.svelte";
    import { $Math as M } from '../../utils/math';

    export let gain = 0;

    let value = (() => {
        if (gain === -Infinity) return 0;
        if (gain < 0) return M.roundTo(1, (gain + 60) / 60 * 50);
        if (gain === 0) return 50;
        if (gain < 24) return M.roundTo(1, gain * 100 / 24 + 50);
        return 100;
    })();

    $: gain = M.roundTo(1, (value - 50) * (24 / 100));
</script>

<Knob bind:value={value} />