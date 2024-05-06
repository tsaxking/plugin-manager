<script lang="ts">
  import { RackItem } from "../model/rack-item";
    import FacePlate from "./RackItem.svelte";
import RackImage from "./RackBackground.svelte";


const i = new RackItem(
    [4,1],
    8,
    'danger',
    'Compressor',
    {
        audio: [2, 2],
        midi: [0, 0],
        cv: [0, 0],
    },
    "note"
);
</script>

<RackImage x={200} y={3}/>

<FacePlate item={i}/>