<script lang="ts">
import { onMount } from "svelte";
import { toCamelCase } from "../utils/text";

    export let navbar: {
        title: string;
        items: {
            name: string;
            action: () => void;
        }[];
        show?: boolean;
    }[] = [];

    onMount(() => {
        const hide = (e: MouseEvent) => {
            for (let i = 0; i < navbar.length; i++) {
                if (e.target instanceof HTMLElement && e.target.getAttribute('data-navbar-item') === navbar[i].title) continue;
                navbar[i].show = false;
            }
        };

        document.addEventListener('click', hide);

        return () => {
            document.removeEventListener('click', hide);
        }
    });
</script>


<nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                {#each navbar as { title, items, show }}
                    <li class="nav-item dropdown">
                        <a class="nav-link py-0" href="#" id="navbarDropdown-{toCamelCase(title)}" role="button" data-bs-toggle="dropdown" aria-expanded="false"
                            on:click={() => show = !show}
                            data-navbar-item="{title}"
                        >
                            {title}
                        </a>
                        <ul class="dropdown-menu p-0 rounded-0"
                            class:show="{show}"
                        aria-labelledby="navbarDropdown-{title}">
                            {#each items as { name, action }}
                                <li><a class="dropdown-item" on:click={action} href="#">{name}</a></li>
                            {/each}
                        </ul>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</nav>

<style>
    .navbar {
        height: var(--navbar-height) !important;
    }
</style>