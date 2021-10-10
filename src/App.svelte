<script lang="ts">
    import CorrespondenceDisplay from "./CorrespondenceDisplay.svelte";
    import InputString from "./InputString.svelte";
    import PermutationDisplay from "./PermutationDisplay.svelte";

    let input_string: string;
</script>

<article>
    <section>
        <h2>Introduction</h2>
        The Burrows-Wheeler Transform is a rearrangement (permutation) of a string
        with several interesting properties. It is widely used in text compression
        as part of the bzip algorithm. It is also very useful in matching several
        short substrings to a large string. This last application, the sequence alignment
        problem, is particularly important for next-generation sequencing techniques
        used in modern-day genetic analyses.
    </section>

    <section>
        <h2>Construction</h2>
        <p>
            Let's actually compute the Burrows-Wheeler transform for the string
            <InputString
                on:string_set={(e) => (input_string = e.detail.input_string)}
            />. Note that we used the <code>~</code> character to indicate the
            end of the string. Think of this like the <code>\0</code> character in
            C-strings. It will be important later.
        </p>
        <p>
            The Burrows-Wheeler transform of a string is constructed in three
            steps:
        </p>
        <ol>
            <li>List all cyclic permutations of the string</li>
            <li>Sort them in lexicographic order, i.e. "dictionary order"</li>
            <li>For each permutation, select the last character</li>
        </ol>
        <p>This is illustrated for the input string below</p>
        <PermutationDisplay base_string={input_string} />
    </section>

    <section>
        <h2>Properties of the BWT</h2>
        <p>Some properties of the BWT are immediately obvious</p>
        <ul>
            <li>
                Every character in the input string is mapped to a unique
                position in the BWT.
            </li>
            <li>
                The first column of the sorted list of permutation has all its
                characters grouped together. This is a consequence of the
                lexicographic order - just as a dictionary is subdivided into
                sections with words starting with 'A', 'B', 'C', etc., so too is
                the first column. So, we can easily compute and compress the first
                column by simply storing the counts of each unique letter in the
                last column.
            </li>
        </ul>
    </section>

    <section>
        <h2>The Correspondence Property</h2>
        <p>
            This is a very useful property of the Burrows-Wheeler transform.
            Suppose that a character of letter <code>c</code> is moved from the
            input string to the first column at position <code>pos_1</code>
            and to the last column at position <code>pos_2</code>. Then the
            property states that the number of <code>c</code> characters before
            <code>pos_1</code> in the first column equals the number of
            <code>c</code> characters before <code>pos_2</code> in the last
            column. In other words, the original character is moved so that if
            it is the <i>i<sup>th</sup></i> <code>c</code> in the first column,
            then it is also the <i>i<sup>th</sup></i> <code>c</code> in the last
            column.
        </p>
        <p>
            Why does this property hold? Think about what it means for a
            character <code>c</code> to be mapped to position <code>pos_1</code>
            in the first column. It means that if that <code>c</code> was
            followed by the string <code>ABCDEF...</code> in the original
            sequence, the permutation at position <code>pos_1</code> is exactly
            <code>cABCDEF...</code>. Similarly, if the character is mapped to
            position <code>pos_2</code> in the last column, it means that the
            permutation at position <code>pos_2</code> is exactly
            <code>ABCDEF...c</code>, due to the cyclic permutations.
        </p>
        <p>
            Therefore, the subset of permutations beginning with a
            <code>c</code> is sorted lexicographically based on the rest of the
            string <code>ABCDEF...</code>. But the subset of permutations ending
            with a <code>c</code> is also sorted lexicographically based on the
            rest of the string <code>ABCDEF...</code>. Hence, they're sorted in
            exactly the same order, and so successive <code>c</code>'s in the
            first column correspond to successive <code>c</code>'s in the last
            column.
        </p>
        <p>This is illustrated below</p>
        <CorrespondenceDisplay base_string={input_string} />
    </section>

    <section>
        <h2>Rank Queries</h2>
        <p>Now th</p>
    </section>
</article>

<style>
    :global(:root) {
        --primary-color: #e2a6af;
        --accent-color: #cf1e39;
        --hl-color: white;
    }

    article {
        max-width: 60em;
        margin: 0 auto;
    }
</style>
