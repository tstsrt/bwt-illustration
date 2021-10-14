<script lang="ts">
    export let base_string: string;

    import { flip } from "svelte/animate";
    import {
        Permutation,
        make_permutations,
        sort_lexicographically,
        sort_by_index,
        get_bwt_from_sorted_perms,
    } from "./permutations";
    type Stages = "list_perms" | "sort_perms" | "hl_last_col";
    const all_stages: Stages[] = ["list_perms", "sort_perms", "hl_last_col"];
    let stage: Stages = "list_perms";
    let perms: Permutation[] = [];
    let bwt: string;

    function set_stage(new_stage: Stages) {
        stage = new_stage;
    }

    function describe(stage: Stages): string {
        switch (stage) {
            case "list_perms":
                return "List permutations";
            case "sort_perms":
                return "Sort permutations";
            case "hl_last_col":
                return "Select last column";
        }
    }

    $: if (base_string) {
        set_stage("list_perms");
        perms = make_permutations(base_string);
    }
    $: switch (stage) {
        case "list_perms":
            perms = sort_by_index(perms);
            bwt = null;
            break;
        case "sort_perms":
        case "hl_last_col":
            perms = sort_lexicographically(perms);
            bwt = get_bwt_from_sorted_perms(perms);
            break;
    }
</script>

<section>
    <ul id="stages-list">
        {#each all_stages as const_stage}
            <li>
                <input
                    type="radio"
                    bind:group={stage}
                    name="stage"
                    value={const_stage}
                    id="stage-{const_stage}"
                    disabled={!base_string}
                />
                <label for="stage-{const_stage}">
                    {describe(const_stage)}
                </label>
            </li>
        {/each}
    </ul>

    <ul id="perms-list">
        {#if base_string}
            {#each perms as perm (perm.index)}
                <li
                    animate:flip={{ duration: 600 }}
                    class:hl={stage === "hl_last_col"}
                >
                    <span>{perm.permutation.slice(0, -1)}</span>&ZeroWidthSpace;
                    <span>{perm.permutation.at(-1)}</span>
                </li>
            {/each}
        {:else}
            <li>No string defined</li>
        {/if}
    </ul>

    {#if bwt && stage === "hl_last_col"}
        <p>The Burrows-Wheeler Transform is <b>{bwt}</b></p>
    {/if}

    <p class="caption">The permutations of the input string</p>
</section>

<style>
    section {
        display: flex;
        flex-flow: row wrap;
        justify-content: start;
        margin: 1em 0;
        padding: 0;
    }

    ul {
        padding: 0;
    }

    li {
        list-style-type: none;
        font-family: monospace;
        font-size: 1.3em;
    }

    li > span {
        margin: 0;
        padding: 0;
        transition: opacity 0.3s;
    }

    li.hl > span:first-child {
        opacity: 0.4;
    }

    li.hl > span:last-child {
        font-weight: 700;
    }

    input[type="radio"] {
        display: none;
    }

    input[type="radio"]:checked + label {
        color: var(--accent-color);
        font-weight: 700;
    }

    input[type="radio"]:disabled + label {
        color: #808080;
        font-weight: 400;
    }

    #perms-list {
        display: flex;
        flex-flow: column nowrap;
        flex: 1 1 auto;
        min-width: 4em;
        max-width: 20em;
        margin: 1em auto;
    }

    #stages-list {
        display: flex;
        flex-flow: column nowrap;
        flex: 0 0 auto;
        margin-right: 1em;
    }

    #stages-list > li {
        max-width: 14em;
        margin: 0 1em;
    }

    #stages-list label {
        padding: 0.4em 1em;
        border-radius: 4px;
    }

    p {
        width: 100%;
        text-align: center;
    }

    p.caption::before {
        content: "Figure: ";
        font-weight: 700;
    }
</style>
