<script lang="ts">
import { onMount } from 'svelte';
import { Channel } from '../model/channel';
    import Io from './ChannelIO.svelte';
import Fader from './knobs/Fader.svelte';
    import Gain from "./knobs/Gain.svelte";
    import { RackItem as R } from '../model/rack-item';
    import RackItem from './RackItem.svelte';
import RackBorder from './RackBorder.svelte';
import Editable from './Editable.svelte';
import { Stack } from '../utils/event-stack';

    export let channel: Channel;
    export let stack: Stack;
    
    let rack: R[] = [];


    onMount(() => {
        channel.getRack().then(r => rack = r.unwrap());
    });

    </script>
    
<div class="channel">
    <!-- <h4 class="w-100 text-center">{channel.name}</h4> -->
     <Editable bind:value={channel.name} classes="w-100 text-center" {stack} />
        <div class="d-flex 
                    justify-content-between 
                    align-items-center">
            <Gain bind:gain={channel.gain} {stack}/>
            {channel.gain} db
        </div>
    <hr>
    <RackBorder {stack} {channel} index={0}/>
    {#each rack as item,i}
        <RackItem {item} {stack} />
        <RackBorder {stack} {channel} index={i+1}/>
    {/each}
    <hr>
    <div class="bottom">
        <hr>
        <div class="d-flex 
                    justify-content-between 
                    align-items-center
                    ">
            <Fader bind:fader={channel.fader} {stack} />
        </div>
        <hr>
        <Io {channel} />
    </div>
</div>

    
    <style>
    
        .channel {
            display: flex;
            flex-direction: column;
            width: 152px;
            height: 100%;
            /* border-radius: var(--border-radius); */
            border: var(--bs-secondary) 1px solid;
        }

        
        .bottom {
            margin-top: auto;
        }
    </style>