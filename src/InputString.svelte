<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Form from "./Form.svelte";
    import Icon from "@iconify/svelte";
    import dice from "@iconify/icons-gg/dice-5";

    const dispatch = createEventDispatcher();
    let input_string: string;

    function send_data() {
        dispatch("string_set", {
            input_string: input_string + "~",
        });
    }

    function gen_random() {
        const letters = "ATGC";
        const string_size = 20;
        input_string = "";
        for (let i = 0; i < string_size; i++) {
            const index = Math.floor(Math.random() * letters.length);
            input_string += letters[index];
        }
        input_string = input_string;
    }
</script>

<Form {send_data}>
    <button name="random" type="button" on:click={gen_random} aria-label="Generate Random String">
        <Icon icon={dice} inline={true} />
    </button>
    <input
        type="text"
        name="input-string"
        bind:value={input_string}
        accept="[a-zA-Z0-9]+"
        placeholder="string"
        required
    />
    ~
</Form>

<style>
    input[type="text"] {
        border: none;
        border-radius: 0;
        outline: 0;
        margin: 0;
        padding: 0;
    }
    
    button {
        border-radius: 4px;
        background-color: #fff0;
        border: 0;
        outline: none;
        margin: 0 0.5em;
        padding: 0;
        transition: all 0.2s;
    }

    button:hover {
        color: var(--accent-color);
    }
</style>
