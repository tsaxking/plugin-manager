<script lang="ts">
import { Channel } from "../model/channel";
import { Stack } from "../utils/event-stack";

    export let index: number;
    export let channel: Channel;
    export let stack: Stack;

    const add = () => {
        console.log('add', channel, index);
    };
</script>

<div class="border">
    <hr>
    <div class="rack-border">
        <button on:click={add}
            class="btn btn-primary"
        >
        <i class="material-icons">add</i>
    </button>
    </div>
</div>


<style>
    .border {
        position: relative;
        width: 100%;
        height: 1px;
    }

    .rack-border button {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
    }

    .rack-border {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);

        transition: opacity 0.3s;
    }

    .rack-border:hover {
        opacity: 1;
    }
</style>