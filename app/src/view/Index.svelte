<script lang="ts">
  import NavBar from "./NavBar.svelte";
  import Rack from "./Rack.svelte";

  export let display: 'io' | 'control' = 'io';
</script>

<NavBar bind:display={display} />
<Rack bind:display={display} />