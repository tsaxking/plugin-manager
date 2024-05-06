<slot />

<div class="position-fixed rack">
    <div class="rack-side position-fixed end-0"></div>
    <div class="rack-side position-fixed"></div>
</div>


<style>
    .rack-side {
        background-color: rgb(89, 89, 89);
        width: 20px;
        height: 100vh;
        z-index: 1;
    }

    .rack {
        width: 100%;
        height: 100vh;
        z-index: 1;
    }
</style>