<script lang="ts">
    import Form from "./Form.svelte";
    import PermutationDisplay from "./PermutationDisplay.svelte";

    let input_string: string;
</script>

<article>
    <h2>Introduction</h2>
    <Form on:string_set={(e) => (input_string = e.detail.input_string)} />
    <PermutationDisplay base_string={input_string} />
</article>

<style>
    :global(:root) {
        --primary-color: #331116;
        --accent-color: #cf1e39;
        --hl-color: white;
    }
</style>
