<script lang="ts">
  import { RackItem } from "../model/rack-item";
    import FacePlate from "./RackItem.svelte";
import RackImage from "./RackBackground.svelte";


const i = new RackItem(
    [4,1],
    8,
    'dark',
    'Compressor',
    {
        audio: [4, 2],
        midi: [1, 0],
        cv: [0, 1],
    },
    "note"
);
</script>

<RackImage x={200} y={3}/>

<FacePlate item={i}/>