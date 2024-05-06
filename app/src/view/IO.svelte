<script lang="ts">
    import { Color } from "../utils/color";
    export let name: string;
    export let type: 'midi' | 'audio' | 'cv' = 'audio';

    let color = (() => {
        switch (type) {
            case 'audio':
                return new Color(0, 0, 255, .75);
            case 'midi':
                return new Color(0, 255, 0, .75);
            case 'cv':
                return new Color(255, 0, 0, .75);
        }
    })();
</script>

<p
    style="background-color: {color.toString('rgba')};"
    class="p-2 m-2"
>
    {name}
</p>

<style>
    p {
        border-color: white;
        border-width: 1px;
        border-style: solid;
    }
</style>