<script lang="ts">

export let name: string;
</script>

<div class="rack-item rounded-3 shadow p-3 no-select my-1">
    <h6>{name}</h6>
    <slot />
</div>

<style>
    .rack-item {
        background-color: rgb(24, 23, 23);
        width: 100%;
        height: 100px;
    }
</style>