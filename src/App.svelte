<script lang="ts">
    import CorrespondenceDisplay from "./CorrespondenceDisplay.svelte";
    import InputString from "./InputString.svelte";
    import PermutationDisplay from "./PermutationDisplay.svelte";
    import RankDisplay from "./RankDisplay.svelte";

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
                the first column. So, we can easily compute and compress the
                first column by simply storing the counts of each unique letter
                in the last column.
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
        <p>
            Now, we'll see a nice application of the correspondence property.
            Suppose we have a letter <code>c</code> at position <code>pos</code>
            in the Burrows-Wheeler transform. We define that character's
            <emph>rank</emph> to be the number of <code>c</code>'s come before
            <code>pos</code> in the BWT. From the correspondence property, it is
            equal to the position of that character <code>c</code> in the first
            column, relative to the first <code>c</code>.
        </p>
        <p>
            But why is this useful? This is because if we get the index of the
            corresponding <code>c</code> in the first column, the last character
            in that row is the character <code>d</code> that comes immediately
            before <code>c</code> in the original string. So, if we can calculate
            the rank of characters in the Burrows-Wheeler transform, we can easily
            walk backwards through the original string.
        </p>
        <p>
            So, how do we calculate the rank of any character? One way to do it
            would be to travel all the way from the start of the string to the
            character of interest and count the number of <code>c</code>'s along
            the way. For very long strings, like the human genome with about 3
            billion characters, this takes way too long. Another approach is to
            pre-compute the rank of every character, so that every rank
            calculation is extremely fast. But this takes too much space - an
            unsigned integer per base pair of the human genome requires about
            12GB of space. We're left with a conundrum - do we suffer through
            the long computation for every rank calculation or do we suck it up
            and spend a lot of money to buy more RAM?
        </p>
        <p>
            Fortunately, there's a way out of this conundrum. Suppose we store the
            pre-computed ranks for only a few characters - say every Δ characters in
            the BWT. Then, to calculate the rank of any character <code>c</code>, we
            only need to walk to <code>c</code> from the nearest "checkpoint" at which
            we pre-computed the rank, counting other <code>c</code>'s along the way.
            This way, we've increased our computation time somewhat but reduced our
            space usage. Importantly, we can tune Δ for our computer so that we use
            as much memory as we can so that we can speed up the rank query.
        </p>
        <p>This is illustrated below</p>
        <RankDisplay base_string={input_string} />
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

    code {
        font-size: 1.3em;
        background-color: #f0f0f0;
        padding: 0.1ex 0.3em;
        border-radius: 5px;
    }
</style>
