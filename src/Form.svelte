<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import right_arrow from "@iconify/icons-gg/arrow-right";
    import dice from "@iconify/icons-gg/dice-5";

    const dispatch = createEventDispatcher();
    let input_string: string;

    function send_data() {
        dispatch("string_set", {
            input_string: input_string + "~",
        });
    }

    function gen_random() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        input_string = "";
        for (let i = 0; i < 10; i++) {
            const index = Math.floor(Math.random() * letters.length);
            input_string += letters[index];
        }
        input_string = input_string;
    }
</script>

<form on:submit|preventDefault={send_data}>
    <button name="random" type="button" on:click={gen_random}>
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
    <button type="submit"><Icon icon={right_arrow} inline={true} /></button>
</form>

<style>
    input[type="text"] {
        border: none;
        border-radius: 0;
        outline: 0;
        margin: 0;
        padding: 0;
    }

    form {
        position: relative;
        width: max-content;
    }

    form::before {
        display: block;
        position: absolute;
        bottom: -0.2ex;
        left: 0;
        content: "";
        width: 100%;
        height: 0.1ex;
        background-color: black;
    }

    form::after {
        display: block;
        position: absolute;
        bottom: -0.2ex;
        left: 0;
        content: "";
        width: 100%;
        height: 0.2ex;
        background-color: var(--accent-color);
        transform-origin: 0;
        transform: scaleX(0);
        transition: all 0.1s;
    }

    form:focus-within::after {
        transform: scaleX(1);
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
