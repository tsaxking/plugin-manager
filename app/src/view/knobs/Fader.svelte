<script lang="ts">
    import { Color } from "../../utils/color";
export let fader = 0;

let value = (() => {
    switch (true) {
        case fader === -Infinity:
            return 0;
        case fader < 0:
            // -60db to 0db
            return Math.round((fader + 60) / 60 * 80);
        case fader === 0:
            return 80;
        case fader < 10:
            // 0db to 10db
            return Math.round(fader * 20 / 10 + 80);
        default:
            return 100;
    }
})();

$: {
    switch (true) {
        case value === 0:
            fader = -Infinity;
            break;
        case value < 80:
            // -60db to 0db
            fader = Math.round(-60 + (value / 80) * 60);
            break;
        case value === 80:
            fader = 0;
            break;
        case value < 100:
            // 0db to 10db
            fader = Math.round((value - 80) * 10 / 20);
            break;
    }
}

const primary = Color.fromBootstrap('primary').toString('rgb');
const dark = Color.fromName('black').toString('rgb');
</script>



<input type="range" class="input-slider" data-width="16" data-height="100" bind:value={value} 
    data-bgcolor={dark} data-fgcolor={primary}
/>