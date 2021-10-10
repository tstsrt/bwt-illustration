export class Permutation {
    index: number;
    permutation: string;
}

export function make_permutations(base_string: string): Permutation[] {
    let perms: Permutation[] = [];
    for (let i = 0; i < base_string.length; i++) {
        let perm = base_string.slice(i) + base_string.slice(0, i);
        perms.push({ index: i, permutation: perm });
    }
    return perms;
}

export function sort_by_index(perms: readonly Permutation[]): Permutation[] {
    return [...perms].sort((p1, p2) => p1.index - p2.index);
}

export function sort_lexicographically(
    perms: readonly Permutation[]
): Permutation[] {
    return [...perms].sort((p1, p2) => {
        if (p1.permutation === p2.permutation) return 0;
        return p1.permutation > p2.permutation ? 1 : -1;
    });
}
