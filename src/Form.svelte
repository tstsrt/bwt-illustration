<script lang="ts">
    import Icon from "@iconify/svelte";
    import right_arrow from "@iconify/icons-gg/arrow-right";

    export let send_data: () => void | null = null;
</script>

<form
    on:submit|preventDefault={() => {
        send_data && send_data();
    }}
>
    <slot />
    {#if send_data}
        <button type="submit"><Icon icon={right_arrow} inline={true} /></button>
    {/if}
</form>

<style>
    form {
        display: inline;
        position: relative;
        width: max-content;
        margin: 0.2ex 0.5em;
    }

    form::before {
        display: block;
        position: absolute;
        bottom: -0.2ex;
        left: 0;
        content: "";
        width: 100%;
        height: 1px;
        background-color: black;
    }

    form::after {
        display: block;
        position: absolute;
        bottom: -0.2ex;
        left: 0;
        content: "";
        width: 100%;
        height: 2px;
        background-color: var(--accent-color);
        transform-origin: 0;
        transform: scaleX(0);
        transition: all 0.1s;
    }

    form:focus-within::after {
        transform: scaleX(1);
    }

    button {
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
