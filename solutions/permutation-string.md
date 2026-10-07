---
# Permutation In String · Medium · Sliding Window
# https://leetcode.com/problems/permutation-in-string/
draft: false
pattern: "Fixed-width window of letter counts"
time: "O(n + m)"
space: "O(1)"
---

## Description

Given lowercase strings `s1` and `s2`, return `True` if some contiguous substring of `s2` is
a permutation of `s1`; otherwise, return `False`.

**Example**

```
Input: s1 = "ab", s2 = "eidbaooo"
Output: true
```

Explanation: The substring `"ba"` has the same character counts as `"ab"`.

## Intuition

A matching substring must have length `len(s1)` and exactly the same count for each of the 26
lowercase letters. This gives a fixed-width sliding window. Moving that window changes only two
counts: one character enters from the right and one leaves from the left.

## Approach

1. Let `n = len(s1)` and `m = len(s2)`. Return `False` when `n > m`, because no window can
   be long enough.
2. Build `need` from `s1` and `window` from the first `n` characters of `s2`, using one slot
   per lowercase letter.
3. Compare the initial vectors, then slide the window across `s2`. For each new right endpoint
   `r`, add `s2[r]` and remove `s2[r - n]`.
4. Return `True` on the first equal pair of vectors; return `False` if no window matches.

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

After initialization, `window` counts exactly the first `n` characters of `s2`. Each slide adds
the new right character and removes the character exactly `n` positions behind it, so the
invariant remains true for every length-`n` substring. Two equal-length strings are permutations
if and only if their character-count vectors are equal. The algorithm tests that condition for
every possible window, so it returns `True` exactly when a permutation occurs.

**Complexity**

- **Time:** `O(n + m)`; each vector comparison examines a fixed 26 entries.
- **Space:** `O(1)` for two fixed-size count arrays.
