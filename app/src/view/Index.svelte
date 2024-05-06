<script lang="ts">
    import { onMount } from 'svelte';
    let message = '';
    onMount(() => {
        message = 'Hello World!';
    });
</script>

<h1>{message}</h1>