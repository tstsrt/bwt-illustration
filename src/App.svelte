<script lang="ts">
    import CorrespondenceDisplay from "./CorrespondenceDisplay.svelte";
    import InputString from "./InputString.svelte";
    import PermutationDisplay from "./PermutationDisplay.svelte";
    import RankDisplay from "./RankDisplay.svelte";
    import StringMatchDisplay from "./StringMatchDisplay.svelte";

    let input_string: string;
</script>

<article>
    <header>
        <h1>
            The Burrows-Wheeler Transform in String Matching: An Interactive
            Demo
        </h1>
        <address>
            By <a href="mailto:ninadhuilgol@iisc.ac.in" rel="author">Ninad</a>
        </address>
    </header>

    <section>
        <h2>Introduction</h2>
        <p>
            The Burrows-Wheeler Transform is a rearrangement (permutation) of a
            string with several interesting properties. It is widely used in
            text compression as part of the bzip algorithm. It is also very
            useful in matching several short substrings to a large string. This
            last application, the sequence alignment problem, is particularly
            important for next-generation sequencing techniques used in
            modern-day genetic analyses.
        </p>
        <p>
            This page is my attempt to try and visualise some of the concepts and
            constructions involved in using the Burrows-Wheeler Transform. The steps
            shown in this article are computed interactively. Feel free to use your own
            inputs to see how the BWT works.
        </p>
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
            Fortunately, there's a way out of this conundrum. Suppose we store
            the pre-computed ranks for only a few characters - say every Δ
            characters in the BWT. Then, to calculate the rank of any character <code
                >c</code
            >, we only need to walk to <code>c</code> from the nearest
            "checkpoint" at which we pre-computed the rank, counting other
            <code>c</code>'s along the way. This way, we've increased our
            computation time somewhat but reduced our space usage. Importantly,
            we can tune Δ for our computer so that we use as much memory as we
            can so that we can speed up the rank query.
        </p>
        <p>This is illustrated below</p>
        <RankDisplay base_string={input_string} />
    </section>

    <section>
        <h2>Using Rank Queries for String Matching</h2>
        <p>
            I mentioned that we can use rank queries to walk backwards through
            the original string. Let's try to use that idea to try and match
            substrings of the string. Here's an interesting property - all
            permutations of the original string of the form <code>IJK...</code>,
            i.e. permutations starting with <code>IJK</code>, are present
            contiguously in the Burrows-Wheeler table. Similarly, given any
            prefix of a permutation, all substrings with that prefix are present
            contiguously in the Burrows-Wheeler table. So, for a given prefix,
            if we know the starting and ending indices of its occurrences, we
            get all other occurrences for free in the Burrows-Wheeler table!
        </p>
        <p>
            So let's say we know the positions of permutations beginning with
            <code>IJK</code>. Suppose they're in indices <code>i</code> to
            <code>j</code>. We can now calculate the positions of permutations
            beginning with <code>LIJK</code>. Let the first <code>L</code> in
            the BWT in the range <code>i..j</code> be <code>i'</code> and the
            last <code>L</code> in the BWT in <code>i..j</code> be
            <code>j'</code>. Now, the permutation at index <code>rank(i')</code>
            is a permutation beginning with <code>LIJK</code>, and so is the
            permutation at index <code>rank(j')</code>. But now, every
            intermediate value in the range <code>rank(i')..rank(j')</code> is
            also a permutation beginning with <code>LIJK</code>. And due to the
            correspondence property, these <code>L</code>'s must lie in
            <code>i'..j'</code>. Therefore, by looking at just the first and
            last <code>L</code>'s in the range <code>i..j</code>, we could get
            the entire range <code>rank(i')..rank(j')</code> for free!
        </p>
        <p>
            This gives us an algorithm to find substrings in the original
            string. Start with the indices <code>i = 0; j = len(bwt)</code> and
            matched string <code>""</code>. Now, iteratively match the next
            character of the substring from the end, "squeezing" the range of
            possible matches as above. At the end, either we'll get a range of
            permutations in the Burrows-Wheeler table that start with the full
            substring, or at some point the squeezed range will become empty. In
            the former case, we've found all possible positions of the substring
            and in the latter case, we know that the substring is not in the
            original string.
        </p>
        <p>
            Of course, we need to know the mapping between permutations in the
            Burrows-Wheeler table and positions in the original string. But we
            can store this information while constructing the BWT, or calculate
            it by counting the number of traversals needed to reach <code
                >~</code
            >
            in the BWT using rank queries. This is the importance of the final
            <code>~</code> character. As before with rank queries, we can reduce
            the memory needed to store this mapping by storing it at Δ milestones
            only.
        </p>
        <p>This is illustrated below</p>
        <StringMatchDisplay base_string={input_string} />
    </section>

    <section>
        <h2>Conclusion</h2>
        <p>
            So what did we achieve by doing all this? First, the BWT is a very
            compact data structure, even including the rank and backreference
            lookup tables. So, we can use it without requiring a huge amount of
            RAM. Also, since each string matching step depends only on the
            characters of the query string, once we've constructed the rank and
            backreference tables, we can search for substrings in a time
            proportional to the length of the <emph>substring</emph>, and not
            the whole string. So, for querying multiple short substrings, it's
            very efficient time-wise as well.
        </p>
        <p>
            This article is based largely on the lectures of
            <a href="http://hariharan-ramesh.com">Prof Ramesh Hariharan</a> given
            at IISc.
        </p>
    </section>
</article>

<style>
    :global(:root) {
        --primary-color: #e2a6af;
        --accent-color: #cf1e39;
        --hl-color: white;
    }

    a {
        color: var(--accent-color);
    }

    article {
        max-width: 60em;
        margin: 0 auto;
        margin-bottom: 8ex;
    }

    code {
        font-size: 1.3em;
        background-color: #f0f0f0;
        padding: 0.1ex 0.3em;
        border-radius: 5px;
    }
</style>
