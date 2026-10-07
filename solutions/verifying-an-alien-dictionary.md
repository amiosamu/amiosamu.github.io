---
# Verifying An Alien Dictionary · Easy · Graphs
# https://leetcode.com/problems/verifying-an-alien-dictionary/
draft: false
pattern: "Rank map, compare adjacent words"
time: "O(n * m)"
space: "O(1)"
---

## Description

Given a list of `words` that supposedly follow the letter order of an alien language, and
a string `order` giving that language's 26-letter alphabet, determine whether `words` is
sorted according to `order` using normal lexicographic rules (where a word that is a strict
prefix of the next one is considered smaller).

**Example**

```
Input: words = ["hello","leetcode"], order = "hlabcdefgijkmnopqrstuvwxyz"
Output: true
```

In the alien order, `'h'` precedes `'l'`, so the first differing letters order the pair correctly.


## Intuition

Convert each alien character to its rank, then compare adjacent words lexicographically. The first
different character determines a pair's order. If no characters differ across their shared
prefix, the shorter word must come first; this rejects cases such as `"apple"` before `"app"`.

## Approach

1. Build `rank`, mapping each of the 26 letters to its position in `order`.
2. Compare every adjacent pair `w1, w2` from left to right.
3. If `w2` ends before any difference appears, reject because it is a strict prefix of `w1`.
4. At the first difference, reject if `w1`'s character has the larger rank; otherwise stop
   checking that pair.
5. Return `True` if every adjacent pair is ordered.

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

For each pair, the inner loop implements the definition of lexicographic order: the first unequal
characters decide the order, or the shorter word wins when one is a prefix. Thus it accepts exactly
the correctly ordered adjacent pairs. Lexicographic order is transitive, so all adjacent pairs are
ordered if and only if the entire list is sorted.

**Complexity**

- **Time:** `O(n * m)` for `n` words of maximum length `m`.
- **Space:** `O(1)` because the rank map always has 26 entries.
