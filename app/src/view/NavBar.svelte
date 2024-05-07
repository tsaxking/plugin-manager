<script lang="ts">
    export let display: 'io' | 'control' = 'io';
</script>

<ul class="nav nav-tabs">
    <li class="nav-item">
        <a on:click={() => display = 'io'} href="#" class="nav-link" class:active={display === 'io'}>I/O</a>
    </li>
    <li class="nav-item">
        <a on:click={() => display = 'control'} href="#" class="nav-link" class:active={display === 'control'}>Control</a>
    </li>
</ul>