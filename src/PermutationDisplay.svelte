<script lang="ts">
    export let base_string: string;

    import { flip } from "svelte/animate";
    type Stages = "list_perms" | "sort_perms" | "hl_last_col";
    const all_stages: Stages[] = ["list_perms", "sort_perms", "hl_last_col"];
    let stage: Stages = "list_perms";
    interface Permutation {
        index: number;
        permutation: string;
    }
    let perms: Permutation[] = new Array();

    function set_stage(new_stage: Stages) {
        stage = new_stage;
    }

    function clear_perms() {
        perms = [];
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
        clear_perms();
        set_stage("list_perms");
        for (let i = 0; i < base_string.length; i++) {
            let perm = base_string.slice(i) + base_string.slice(0, i);
            perms.push({ index: i, permutation: perm });
        }
        perms = perms;
    }
    $: switch (stage) {
        case "list_perms":
            perms.sort((p1, p2) => p1.index - p2.index);
            perms = perms;
            break;
        case "sort_perms":
        case "hl_last_col":
            perms.sort((p1, p2) => {
                if (p1.permutation === p2.permutation) return 0;
                return p1.permutation > p2.permutation ? 1 : -1;
            });
            perms = perms;
            break;
    }
</script>

<section>
    <ul id="perms-list">
        {#each perms as perm (perm.index)}
            <li animate:flip={{ duration: 600 }}>
                <span>{perm.permutation.slice(0, -1)}</span><span
                    >{perm.permutation.at(-1)}</span
                >
            </li>
        {/each}
    </ul>

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
</section>

{#if stage === "hl_last_col"}
    <style>
        li > span:first-child {
            opacity: 0.4;
        }
    </style>
{/if}

<style>
    section {
        display: flex;
        flex-flow: row wrap;
        margin: 0;
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

    input[type="radio"] {
        display: none;
    }

    input[type="radio"]:checked + label {
        box-shadow: 0 0 4px #00000080;
    }

    input[type="radio"]:disabled + label {
        box-shadow: none;
        color: #808080;
    }

    #perms-list {
        display: flex;
        flex-flow: column nowrap;
        flex: 1 1 auto;
        min-width: 4em;
        max-width: 20em;
        margin-left: 1em;
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
</style>
