<script lang="ts">
    import Form from "./Form.svelte";
    import {
        make_permutations,
        Permutation,
        sort_lexicographically,
    } from "./permutations";
    import Icon from "@iconify/svelte";
    import dice from "@iconify/icons-gg/dice-5";
    export let base_string: string;

    let char: string;

    function should_hl(
        perm: Permutation,
        hl_index: number,
        test_char: string
    ): boolean {
        return perm.permutation.at(hl_index) == test_char;
    }
    
    function set_random() {
        const unique_chars = Array.from(new Set(base_string));
        char = unique_chars[Math.floor(Math.random() * unique_chars.length)];
    }


    let perms: Permutation[] = [];

    $: if (base_string) {
        perms = sort_lexicographically(make_permutations(base_string));
    }
</script>

<Form>
    <button on:click={set_random}>
        <Icon icon={dice} inline={true}/>
    </button>
    <input type="text" bind:value={char} placeholder="Enter a query character" />
</Form>

<section>
    <div>
        <ul id="col-first">
            {#each perms as perm, index (perm.index)}
                <li class:highlight={should_hl(perm, 0, char)}>
                    <span>{perm.permutation.at(0)}</span><span
                        >{perm.permutation.slice(1)}</span
                    >
                </li>
            {/each}
        </ul>
        <p>First column {char || "?"} entries</p>
    </div>

    <div>
        <ul id="col-last">
            {#each perms as perm, index (perm.index)}
                <li class:highlight={should_hl(perm, -1, char)}>
                    <span>{perm.permutation.slice(0, -1)}</span><span
                        >{perm.permutation.at(-1)}</span
                    >
                </li>
            {/each}
        </ul>
        <p>Last column {char || "?"} entries</p>
    </div>
</section>

<style>
    section {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
    }

    input {
        border: none;
        outline: none;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li {
        opacity: 0.4;
    }

    li.highlight {
        opacity: 1;
    }

    #col-first li.highlight span:first-child {
        font-weight: 700;
    }

    #col-first li.highlight span:last-child {
        color: var(--accent-color);
    }

    #col-last li.highlight span:first-child {
        color: var(--accent-color);
    }

    #col-last li.highlight span:last-child {
        font-weight: 700;
    }

    p {
        text-align: center;
    }

    button {
        outline: none;
        border: none;
        background-color: #fff0;
        margin: 0 0.5em;
        padding: 0;
        transition: all 0.2s;
    }

    button:hover {
        color: var(--accent-color);
    }
</style>
