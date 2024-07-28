<script lang="ts">
    import Fader from './knobs/Fader.svelte';
    import Gain from "./knobs/Gain.svelte";
    import RackItem from "./RackItem.svelte";

    export let name: string;
    
    let gain = 0;
    let volume = 0;
    </script>
    
<div class="channel">
    <h4 class="w-100 text-center">{name}</h4>
    <hr>
    <RackItem>
        <div class="d-flex 
                    justify-content-between 
                    align-items-center">
            <Gain bind:gain={gain}/>
            +{gain} db
        </div>
    </RackItem>
    <hr>
    <div class="bottom">
        <hr>
        <RackItem>
            <div class="d-flex 
                        justify-content-between 
                        align-items-center">
                <Fader bind:fader={volume}/>
                {volume} db
            </div>
        </RackItem>
    </div>
</div>

    
    <style>
    
        .channel {
            display: flex;
            flex-direction: column;
            width: 150px;
            height: 100%;
            border-radius: var(--border-radius);
            border: var(--bs-secondary) 1px solid;
        }
        .bottom {
            margin-top: auto;
        }
    </style>