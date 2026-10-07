---
# Palindromic Substrings · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/palindromic-substrings/
draft: false
pattern: "Expand around every center, count hits"
time: "O(n^2)"
space: "O(1)"
---

## Description

Given a string, count how many contiguous substrings of it are palindromes. A substring
occurring at different start/end positions counts separately even if the characters are
identical.

**Example**

```
Input: s = "abc"
Output: 3
```

Explanation: The three single-character substrings are palindromes; no longer substring is.

## Intuition

Every palindrome has a unique center: one character for odd lengths or one gap for even lengths.
Expand outward from all such centers while the characters match. Each successful expansion
identifies one distinct substring, so it can be counted immediately without storing it.

## Approach

1. Initialize `res = 0`.
2. For each index `i`, expand around odd center `(i, i)` and even center `(i, i + 1)`.
3. While both pointers are in bounds and their characters match, increment `res` and move both
   pointers outward.
4. Stop an expansion at its first mismatch and return the final count.

## Code

```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        res = 0

        for i in range(len(s)):
            for l, r in ((i, i), (i, i + 1)):
                while l >= 0 and r < len(s) and s[l] == s[r]:
                    res += 1
                    l -= 1
                    r += 1

        return res
```

## Why it works

Every palindromic substring has exactly one midpoint, represented by one of the odd or even centers
examined by the loops. Expanding from that center reaches the substring because all mirrored pairs
match. Conversely, each successful expansion has matching mirrored characters and is therefore a
palindrome. No substring is counted twice because its endpoints determine a unique center. Once a
pair mismatches, every wider substring at that center contains the mismatch and cannot qualify.

**Complexity**

- **Time:** `O(n^2)` across `2n - 1` centers.
- **Space:** `O(1)` auxiliary space.
