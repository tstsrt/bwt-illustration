<script lang="ts">
    import Form from "./Form.svelte";

    export let base_string: string;
    import {
        Permutation,
        make_permutations,
        sort_lexicographically,
    } from "./permutations";

    let matched_str: string = "";
    let next_char: string;

    let perms: Permutation[];
    let start_index: number = null;
    let end_index: number = null;
    let next_start_index: number = null;
    let next_end_index: number = null;
    let new_start_index: number = null;
    let new_end_index: number = null;

    $: if (base_string) {
        perms = sort_lexicographically(make_permutations(base_string));
        start_index = perms.findIndex((p) =>
            p.permutation.startsWith(matched_str)
        );
        if (start_index === -1) {
            start_index = null;
        }
        end_index = perms
            .reverse()
            .findIndex((p) => p.permutation.startsWith(matched_str));
        perms.reverse();
        if (end_index === -1) {
            end_index = null;
        } else {
            end_index = base_string.length - 1 - end_index;
        }
    }
    $: if (base_string && next_char) {
        next_start_index = perms
            .slice(start_index, end_index + 1)
            .findIndex((p) => p.permutation.endsWith(next_char));
        if (next_start_index === -1) {
            next_start_index = null;
        } else {
            next_start_index = start_index + next_start_index;
        }
        next_end_index = perms
            .slice(start_index, end_index + 1)
            .reverse()
            .findIndex((p) => p.permutation.endsWith(next_char));
        if (next_end_index === -1) {
            next_end_index = null;
        } else {
            next_end_index = end_index - next_end_index;
        }

        new_start_index = perms.findIndex((p) =>
            p.permutation.startsWith(next_char + matched_str)
        );
        if (new_start_index === -1) {
            new_start_index = null;
        }
        new_end_index = perms
            .reverse()
            .findIndex((p) =>
                p.permutation.startsWith(next_char + matched_str)
            );
        perms.reverse();
        if (new_end_index === -1) {
            new_end_index = null;
        } else {
            new_end_index = base_string.length - 1 - new_end_index;
        }
    }
</script>

<label for="next-char">Next character to match: </label>
<Form>
    <input type="text" bind:value={next_char} name="next-char" aria-label="Next Character" />
</Form>

<Form>
    <input type="text" bind:value={matched_str} name="matched-str" placeholder="Matched substring" />
</Form>

<div>
    <ul id="matched">
        {#if base_string}
            {#each perms as perm, index (perm.index)}
                <li>
                    {#if start_index !== null && end_index !== null && index >= start_index && index <= end_index}
                        <span class="hl-start"
                            >{perm.permutation.slice(
                                0,
                                matched_str.length
                            )}</span
                        >&ZeroWidthSpace;
                        <span
                            >{perm.permutation.slice(
                                matched_str.length,
                                -1
                            )}</span
                        >&ZeroWidthSpace;
                        <span
                            class:next-char={perm.permutation.at(-1) ===
                                next_char}>{perm.permutation.at(-1)}</span
                        >
                    {:else}
                        <span>{perm.permutation}</span>
                    {/if}
                </li>
            {/each}
        {:else}
            <li>No string defined</li>
        {/if}
    </ul>

    <ul id="next">
        {#if base_string}
            {#each perms as perm, index (perm.index)}
                <li>
                    {#if new_start_index !== null && new_end_index !== null && index >= new_start_index && index <= new_end_index}
                        <span class="hl-start"
                            >{perm.permutation.slice(
                                0,
                                matched_str.length + 1
                            )}</span
                        >&ZeroWidthSpace;
                        <span
                            >{perm.permutation.slice(
                                matched_str.length + 1
                            )}</span
                        >
                    {:else}
                        <span>{perm.permutation}</span>
                    {/if}
                </li>
            {/each}
        {:else}
            <li>No string defined</li>
        {/if}
    </ul>
</div>

<style>
    div {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-evenly;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li {
        font-family: monospace;
        font-size: 1.3em;
    }

    span {
        opacity: 0.4;
    }

    .hl-start {
        color: var(--accent-color);
        opacity: 1;
    }

    .next-char {
        font-weight: 700;
        opacity: 1;
    }

    input[type="text"] {
        outline: none;
        border: none;
    }

    input[name="next-char"] {
        width: 2em;
    }

    label {
        display: inline;
    }
</style>
