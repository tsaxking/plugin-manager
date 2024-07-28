<script lang="ts">
    import { Color } from "../../utils/color";
export let value = 0;

const primary = Color.fromBootstrap('primary').toString('rgb');
const dark = Color.fromName('black').toString('rgb');
</script>



<input 
    type="range" 
    class="input-knob"
    bind:value={value}
    data-bgcolor={dark}
    data-fgcolor={primary}
    data-diameter="50"
>