---
# Longest Palindromic Substring · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/longest-palindromic-substring/
draft: false
pattern: "Expand around every center"
time: "O(n^2)"
space: "O(1)"
---

## Description

Given a string `s`, return its longest contiguous substring that reads the same forward and
backward.

**Example**

```
Input: s = "babad"
Output: "bab"
```

Both `"bab"` and `"aba"` have the maximum length `3`; this scan returns `"bab"`.

## Intuition

Every palindrome has a center: one character for odd length or a gap for even length. Expanding
outward while both characters match finds the longest palindrome for that center. Examining both
center types at every index covers all palindromic substrings without separately checking each one.

## Approach

1. Track the best palindrome with `start` and `length`, avoiding slices during the search.
2. For each index `i`, expand around `(i, i)` for odd length and `(i, i + 1)` for even length.
3. Move `l` left and `r` right while both positions are valid and their characters match.
4. After expansion, the maximal palindrome is `s[l + 1:r]` with length `r - l - 1`; update the
   best bounds only when this length is greater.
5. Return one final slice. Empty input would return `""`, while any non-empty input finds at least
   a one-character palindrome.

## Code

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        start, length = 0, 0

        for i in range(len(s)):
            for l, r in ((i, i), (i, i + 1)):
                while l >= 0 and r < len(s) and s[l] == s[r]:
                    l -= 1
                    r += 1
                if r - l - 1 > length:
                    start, length = l + 1, r - l - 1

        return s[start : start + length]
```

## Why it works

Every palindromic substring has exactly one odd or even center considered by the loops. For a fixed
center, each successful expansion adds equal characters to both ends and therefore remains a
palindrome. Expansion stops only at a boundary or unequal pair, so no longer palindrome can share
that center. The algorithm records the longest result across all centers and must therefore record
a globally longest palindromic substring.

**Complexity**

- **Time:** `O(n^2)` in the worst case across all center expansions.
- **Space:** `O(1)` auxiliary space, plus `O(n)` for the returned slice.
