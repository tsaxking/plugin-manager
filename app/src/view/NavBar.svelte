<script lang="ts">
import { Rack } from '../model/state';

export let display: 'io' | 'control' = 'io';
export let rack: Rack;
let performing = false;

type Dropdown = {
    title: string;
    dropdown: { title: string; action: () => void }[];
};

const dropdowns: Dropdown[] = [
    {
        title: 'File',
        dropdown: [
            { title: 'Save', action: () => rack.save() },
            { title: 'Load', action: () => rack.load() },
            { title: ':perform', action: () => (performing = rack.perform()) },
        ],
    },
    {
        title: 'Rack (:display)',
        dropdown: [
            { title: 'IO', action: () => (display = 'io') },
            { title: 'Control', action: () => (display = 'control') },
        ],
    },
];

const replace = (str: string, obj: Record<string, string>): string => {
    return str.replace(/:(\w+)/g, (match, key) => obj[key] || match);
};
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
                >
                    {replace(dropdown.title, { display })}
                </a>
                <ul class="dropdown-menu">
                    {#each dropdown.dropdown as item, j}
                        <li>
                            <a class="dropdown-item" on:click="{item.action}"
                                >{replace(item.title, {
                                    display,
                                    perform: performing ? 'Stop' : 'Start',
                                })}</a
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
