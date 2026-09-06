---
# Permutation In String · Medium · Sliding Window
# https://leetcode.com/problems/permutation-in-string/
draft: false
pattern: "Fixed-width window of letter counts"
time: "O(n + m)"
space: "O(1)"
---

## Intuition

A permutation of `s1` is exactly a substring of `s2` of length `len(s1)` whose letter counts match `s1`'s — order is irrelevant, so only the 26 counts matter. That fixes the window width, and a fixed-width window changes by exactly two counts per step: one letter enters on the right, one leaves on the left. So instead of re-counting each substring, I slide and compare the two 26-slot count arrays.

## Approach

1. Let `n = len(s1)`, `m = len(s2)`. If `n > m` return `False` immediately — no window of that width exists.
2. Build two arrays of 26 zeros, `need` and `window`. Fill `need` from all of `s1` and `window` from the first `n` characters of `s2`, indexing with `ord(ch) - ord('a')`.
3. If `need == window`, return `True` — the very first window can already be the answer.
4. Slide `r` over `range(n, m)`: increment `window` at `s2[r]` (letter entering) and decrement at `s2[r - n]` (letter leaving the left edge).
5. After each slide the window is again exactly `n` wide, so compare `need == window` and return `True` on a match.
6. Return `False` if the loop finishes. The list comparison is 26 fixed slots, so it counts as constant work.

## Code

```python
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        n, m = len(s1), len(s2)
        if n > m:
            return False
        need = [0] * 26
        window = [0] * 26
        for i in range(n):
            need[ord(s1[i]) - ord('a')] += 1
            window[ord(s2[i]) - ord('a')] += 1
        if need == window:
            return True
        for r in range(n, m):
            window[ord(s2[r]) - ord('a')] += 1
            window[ord(s2[r - n]) - ord('a')] -= 1
            if need == window:
                return True
        return False
```

## Why it works

Two strings of equal length are permutations of each other iff their letter-count vectors are equal, so testing `need == window` is exactly the right test — and every length-`n` substring of `s2` is visited once, either as the initial window or after one slide. The add/remove pair maintains the invariant that `window` counts precisely `s2[r-n+1..r]`, so no substring is scored with a stale count. Building the counts is O(n) and the slide does O(26) work over at most `m` positions, giving O(n + m) time and two fixed 26-slot arrays, O(1) space.
