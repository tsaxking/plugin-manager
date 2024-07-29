<script lang="ts">
    import Navbar from "./Navbar.svelte";
    import Mixer from "./Mixer.svelte";
    import Io from "./IO.svelte";
import { Stack } from "../utils/event-stack";
    let page = 'mixer';

    const mixerStack = new Stack('Mixer');
    const ioStack = new Stack('IO');

    $: {
        switch (page) {
            case 'mixer':
                Stack.use(mixerStack);
                break;
            case 'routing':
                Stack.use(ioStack);
                break;
        }
    }
</script>

<Navbar navbar={[{
    title: 'File',
    items: [
        { name: 'New', action: () => console.log('New') },
        { name: 'Open', action: () => console.log('Open') },
        { name: 'Save', action: () => console.log('Save') },
        { name: 'Save As', action: () => console.log('Save As') },
        { name: 'Exit', action: () => console.log('Exit') }
    ]
}, {
    title: 'View',
    items: [
        { name: 'Mixer', action: () => page = 'mixer' },
        { name: 'Routing', action: () => page = 'routing' }
    ]
}]} />
{#if page === 'mixer'}
    <Mixer stack={mixerStack} />
{:else if page === 'routing'}
    <Io stack={ioStack} />
{/if}