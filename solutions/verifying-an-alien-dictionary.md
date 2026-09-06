---
# Verifying An Alien Dictionary · Easy · Graphs
# https://leetcode.com/problems/verifying-an-alien-dictionary/
draft: false
pattern: "Rank map, compare adjacent words"
time: "O(n * m)"
space: "O(1)"
---

## Intuition

This is the graph problem *after* the graph has been solved. In Alien Dictionary I have to
recover the letter order by topologically sorting a precedence graph built from the words;
here `order` hands me that topological order outright, so there is nothing to traverse. The
only thing left is a relabelling: `rank[ch]` is the letter's position in `order`, and the
words are sorted iff every adjacent pair is non-decreasing under normal lexicographic
comparison on ranks.

Sortedness is transitive, so checking adjacent pairs is enough — I never compare `words[i]`
with `words[i + 2]`. The one trap is the prefix rule: `"app"` before `"apple"` is fine,
`"apple"` before `"app"` is not, and a pure character-by-character loop misses that unless I
handle running off the end of the second word.

## Approach

1. Build `rank = {ch: i for i, ch in enumerate(order)}` — 26 entries, so this is `O(1)` space.
2. Iterate over adjacent pairs `w1, w2` via `zip(words, words[1:])`.
3. For `i` in `range(len(w1))`:
   - if `i == len(w2)`, then `w2` is a strict prefix of `w1` and comes second — return `False`;
   - if `w1[i] != w2[i]`, the first difference settles the pair: return `False` when
     `rank[w1[i]] > rank[w2[i]]`, otherwise `break` and move to the next pair.
4. Falling out of the inner loop without breaking means `w1` is a prefix of `w2` (or equal),
   which is correctly ordered — do nothing.
5. If every pair survives, return `True`. A single word (or none) trivially returns `True`
   because `zip` produces no pairs.

## Code

```python
class Solution:
    def isAlienSorted(self, words: List[str], order: str) -> bool:
        rank = {ch: i for i, ch in enumerate(order)}

        for w1, w2 in zip(words, words[1:]):
            for i in range(len(w1)):
                if i == len(w2):
                    return False
                if w1[i] != w2[i]:
                    if rank[w1[i]] > rank[w2[i]]:
                        return False
                    break

        return True
```

## Why it works

Lexicographic order is a total order induced by the letter order, and any total order is
transitive — so a list is sorted exactly when each consecutive pair is in order, which is why
adjacent checks suffice. The inner loop implements the definition literally: the first
position where the words differ decides them, and if no such position exists the shorter word
must come first, which is the `i == len(w2)` case. Each character of the input is examined at
most once, giving `O(n * m)` over `n` words of length up to `m`, with a fixed 26-entry map.
