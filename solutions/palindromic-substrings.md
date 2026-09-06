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

Explanation: the only palindromic substrings are the three single characters `"a"`, `"b"`,
`"c"` — no substring of length two or three reads the same forwards and backwards.

## Intuition

Same machinery as Longest Palindromic Substring, but counting instead of measuring. Verifying
each of the `O(n^2)` substrings separately is `O(n^3)`; expanding from each of the `2n - 1`
centers is `O(n^2)`, and the accounting is even simpler here — every successful expansion step
*is* one more palindromic substring, so you just increment a counter inside the expansion loop
instead of comparing lengths at the end.

## Approach

1. `res = 0`.
2. For each index `i`, run two expansions: the odd center `(l, r) = (i, i)` and the even center
   `(l, r) = (i, i + 1)`.
3. Expansion loop: `while l >= 0 and r < len(s) and s[l] == s[r]`, do `res += 1`, then `l -= 1`
   and `r += 1`. The increment goes *inside* the loop, before moving the pointers — each
   iteration confirms exactly one new palindrome `s[l..r]`.
4. The odd expansion counts the single character `s[i]` on its first iteration, so all `n`
   length-1 palindromes are picked up for free; the even expansion contributes nothing when
   `s[i] != s[i + 1]` and needs no guard.
5. Return `res`.
6. As a table, if you prefer the DP framing: `dp[i][j]` is `True` iff `s[i..j]` is a palindrome,
   considering only that window; recurrence
   `dp[i][j] = (s[i] == s[j]) and (j - i < 2 or dp[i + 1][j - 1])`; base cases `dp[i][i] = True`
   and `dp[i][i + 1] = (s[i] == s[i + 1])`; iterate `i` **descending** with `j` ascending from
   `i` so `dp[i + 1][j - 1]` is already final; the answer is the count of `True` cells rather
   than a single one. Same time, but `O(n^2)` space instead of `O(1)`.

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

Each palindromic substring has exactly one center — a character for odd lengths, a gap for even
— and is reached by exactly one iteration of the expansion from that center, so the count has no
duplicates and no omissions. The expansion is safe to stop at the first mismatch: if `s[l..r]`
fails, every wider substring on the same center contains it as its middle and cannot be a
palindrome either. `2n - 1` centers times `O(n)` expansion is `O(n^2)` time with a single counter
and two pointers, so `O(1)` space.
