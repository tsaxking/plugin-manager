<script lang="ts">
  import NavBar from "./NavBar.svelte";
  import Rack from "./Rack.svelte";
  import { Rack as R } from '../model/state';

  export let display: 'io' | 'control' = 'io';
  export let rack: R;
</script>

<NavBar bind:display={display} {rack} />
<Rack bind:display={display} {rack} />