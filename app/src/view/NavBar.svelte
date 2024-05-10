<script lang="ts">
import { onMount } from 'svelte';
import { Rack } from '../model/state';

export let display: 'io' | 'control' = Rack.display;
export let rack: Rack;

let performing = rack.performing;


type Dropdown = {
    title: string;
    dropdown: { title: string; action: () => void }[];
};

let dropdowns: Dropdown[] = [];

const setDropdowns = () => {
    dropdowns = [
    {
        title: 'File',
        dropdown: [
            { title: 'Save', action: () => rack.save() },
            { title: 'Load', action: () => rack.load() },
        ],
    },
    {
        title: 'Rack',
        dropdown: [
            {
                title: display === 'io' ? 'Control' : 'IO',
                action: () => {
                    Rack.display = display === 'io' ? 'control' : 'io';
                }
            },
            {
                title: performing ? 'Stop Performance Mode' : 'Start Performance Mode',
                action: () => rack.perform()
             },
        ],
    },
    {
        title: 'Actions',
        dropdown: [
            {
                title: 'Play',
                action: () => rack.play(),
            },
            {
                title: 'Stop',
                action: () => rack.stop(),
            },
        ],
    },
];
}

onMount(() => {
    setDropdowns();
    return () => {}
})


Rack.on('display', () => {
    display = Rack.display;
    setDropdowns();
});

Rack.on('perform', (p) => {
    performing = rack.performing;
    setDropdowns();
});
</script>

<nav class="nav">
    <ul class="nav nav-tabs">
        {#each dropdowns as dropdown, i}
            <div class="dropdown">
                <a
                    class="nav-link dd-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    href="#"
                    on:click|preventDefault
                >
                    {dropdown.title}
                </a>
                <ul class="dropdown-menu">
                    {#each dropdown.dropdown as item, j}
                        <li>
                            <a class="dropdown-item" on:click|preventDefault="{item.action}"
                                href="#"
                                >{item.title}</a
                            >
                        </li>
                    {/each}
                </ul>
            </div>
        {/each}
    </ul>
</nav>

<style>
.nav-tabs .nav-link {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    padding: 0.25rem.51rem;
    margin-bottom: 0px;
    font-size: 14px;
    border: 0;
}

.dropdown-item {
    font-size: 12px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    border: 0;
}

.dropdown-menu {
    padding: 0px;
    border: 0;
}
</style>
