<script lang="ts">
import Knob from './Knob.svelte';
import { $Math as M } from '../../utils/math';
import { Stack } from '../../utils/event-stack';
export let stack: Stack;

export let gain = 0;

let value = (() => {
    if (gain === -Infinity) return 0;
    if (gain < 0) return M.roundTo(1, ((gain + 60) / 60) * 50);
    if (gain === 0) return 50;
    if (gain < 484) return M.roundTo(1, (gain * 100) / 48 + 50);
    return 100;
})();

$: gain = M.roundTo(1, (value - 50) * (48 / 100));
</script>

<Knob bind:value {stack} />
