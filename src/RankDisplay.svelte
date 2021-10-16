<script lang="ts">
    export let base_string: string;

    import {
        Permutation,
        sort_lexicographically,
        make_permutations,
        get_bwt_from_sorted_perms,
    } from "./permutations";
    import Form from "./Form.svelte";
    import Icon from "@iconify/svelte";
    import dice from "@iconify/icons-gg/dice-5";

    type rank_strategy = "store-none" | "store-all" | "store-some";

    let perms: Permutation[] = [];
    let bwt: string;
    let user_rank_char: string = "~";
    let ranks: number[] = [];
    let strat: rank_strategy = "store-all";
    let delta: number = 2;

    function calc_ranks(bwt: string, rank_char: string): number[] {
        let ranks: number[] = [];
        for (let char of bwt) {
            let next_rank = ranks.at(-1);
            if (next_rank === undefined) {
                next_rank = -1;
            }
            if (char === rank_char) {
                ranks.push(next_rank + 1);
            } else {
                ranks.push(next_rank);
            }
        }
        return ranks;
    }

    function should_hide(
        strategy: rank_strategy,
        index: number,
        rank_delta: number
    ): boolean {
        if (strategy === "store-none") {
            return true;
        } else if (strategy === "store-all") {
            return false;
        } else if (index % rank_delta === 0) {
            return false;
        } else {
            return true;
        }
    }

    function num_opers(
        strategy: rank_strategy,
        index: number,
        rank_delta: number
    ): number {
        if (strategy === "store-all") {
            return 0;
        } else if (strategy === "store-none") {
            const pos_len = index % bwt.length;
            const neg_len = ((-index % bwt.length) + bwt.length) % bwt.length;
            return Math.min(pos_len, neg_len);
        } else {
            const pos_len = index % rank_delta;
            const neg_len = ((-index % rank_delta) + rank_delta) % rank_delta;
            return Math.min(pos_len, neg_len);
        }
    }

    function set_random() {
        let unique_chars_set = new Set(base_string);
        unique_chars_set.delete("~");
        const unique_chars = Array.from(unique_chars_set);
        let new_index: number = Math.floor(Math.random() * unique_chars.length);
        if (unique_chars[new_index] === user_rank_char) {
            user_rank_char =
                unique_chars[(new_index + 1) % unique_chars.length];
        } else {
            user_rank_char = unique_chars[new_index];
        }
    }

    $: if (base_string) {
        perms = sort_lexicographically(make_permutations(base_string));
        bwt = get_bwt_from_sorted_perms(perms);
        ranks = calc_ranks(bwt, user_rank_char);
    }
</script>

<ul id="strats">
        <li>
            <label for="rank-char">Character to compute ranks for</label>
            <Form>
                <button
                    name="random"
                    type="button"
                    on:click={set_random}
                    aria-label="Generate Random Ranking Character"
                >
                    <Icon icon={dice} inline={true} />
                </button>
                <input
                    type="text"
                    name="rank-char"
                    bind:value={user_rank_char}
                    required
                />
            </Form>
        </li>
        <li>
            <input
                type="radio"
                name="strategies"
                bind:group={strat}
                value="store-none"
                id="strategy-store-none"
                disabled={base_string === undefined}
            />
            <label for="strategy-store-none">Store None</label>
        </li>
        <li>
            <input
                type="radio"
                name="strategies"
                bind:group={strat}
                value="store-all"
                id="strategy-store-all"
                disabled={base_string === undefined}
            />
            <label for="strategy-store-all">Store All</label>
        </li>
        <li>
            <input
                type="radio"
                name="strategies"
                bind:group={strat}
                value="store-some"
                id="strategy-store-some"
                disabled={base_string === undefined}
            />
            <label for="strategy-store-some">Store Some</label>
            <label for="delta"
                >Δ:
                <input
                    type="number"
                    min="1"
                    max={(bwt && bwt.length) || 1}
                    bind:value={delta}
                    disabled={base_string === undefined ||
                        strat !== "store-some"}
                    name="delta"
                />
            </label>
        </li>
        <li class="dummy" />
    </ul>
<div>
    <ul id="perms">
        {#if base_string !== undefined}
            {#each perms as perm (perm.index)}
                <li>
                    <span>{perm.permutation.at(0)}</span>&ZeroWidthSpace;
                    <span>{perm.permutation.slice(1)}</span>
                </li>
            {/each}
        {:else}
            <li><span>No string defined</span></li>
        {/if}
        <li>Permutations</li>
    </ul>

    <ul id="ranks">
        {#if base_string !== undefined}
            {#each ranks as rank, index}
                <li>
                    <span class:hidden={should_hide(strat, index, delta)}
                        >{rank}</span
                    >
                </li>
            {/each}
        {:else}
            <li><span>No string defined</span></li>
        {/if}
        <li>Ranks of Permutations</li>
    </ul>

    <ul id="ops">
        {#if base_string !== undefined}
            {#each ranks as _, index}
                <li>
                    <span>{num_opers(strat, index, delta)}</span>
                </li>
            {/each}
        {:else}
            <li><span>No string defined</span></li>
        {/if}
        <li>Array Traversals needed to calculate rank</li>
    </ul>
</div>

<style>
    div {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-evenly;
    }

    ul {
        padding: 0;
        list-style-type: none;
    }

    li {
        font-family: monospace;
        font-size: 1.3em;
        text-align: center;
    }

    #strats {
        display: flex;
        flex-flow: row wrap;
    }

    #strats > li {
        text-align: start;
        margin: 1ex auto;
    }

    li:last-child {
        font-family: sans-serif;
        font-size: 1em;
        font-weight: 700;
        max-width: 8em;
        margin: auto;
    }

    span.hidden {
        visibility: hidden;
    }

    button {
        background-color: #fff0;
        border: none;
        outline: none;
    }

    input[type="text"] {
        border: none;
        outline: none;
        max-width: 2em;
    }

    input[type="radio"] {
        display: none;
    }

    input[type="radio"]:checked ~ label {
        color: var(--accent-color);
        font-weight: 700;
    }

    input[type="radio"]:disabled ~ label {
        color: black;
        opacity: 0.4;
        font-weight: 400;
    }

    input[type="number"] {
        border: none;
        outline: none;
        width: 4em;
    }

    input[type="number"]:disabled {
        background-color: #fff0;
    }

    label[for="rank-char"] {
        hyphens: auto;
    }

    label[for="delta"] {
        max-width: max-content;
        position: relative;
    }

    label[for="delta"]::before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: -2px;
        left: 0;
        background-color: black;
    }

    label[for="delta"]::after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: -2px;
        left: 0;
        background-color: var(--accent-color);
        transform-origin: 0;
        transform: scaleX(0);
        transition: transform 0.1s;
    }

    label[for="delta"]:focus-within::after {
        transform: scaleX(1);
    }
</style>
