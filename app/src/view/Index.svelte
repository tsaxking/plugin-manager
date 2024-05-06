<script lang="ts">
  import Navbar from "./components/Navbar.svelte";
  import Rack from "./components/Rack.svelte";
  import RackItem from "./components/RackItem.svelte";
</script>

<Navbar tabs={['Rack', 'Patchbay']} />
<Rack>
  <RackItem name="Compressor" />
  <RackItem name="Reverb" />
  <RackItem name="Compressor" />
  <!-- <RackItem name="Reverb" />
  <RackItem name="Compressor" />
  <RackItem name="Reverb" />
  <RackItem name="Compressor" />
  <RackItem name="Reverb" />
  <RackItem name="Compressor" />
  <RackItem name="Reverb" />
  <RackItem name="Compressor" />
  <RackItem name="Reverb" />
  <RackItem name="Compressor" />
  <RackItem name="Reverb" />
  <RackItem name="Compressor" />
  <RackItem name="Reverb" /> -->
</Rack>
