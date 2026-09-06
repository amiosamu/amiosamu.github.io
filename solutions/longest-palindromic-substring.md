---
# Longest Palindromic Substring · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/longest-palindromic-substring/
draft: false
pattern: "Expand around every center"
time: "O(n^2)"
space: "O(1)"
---

## Description

Given a string `s`, return the longest contiguous substring of `s` that reads the same
forwards and backwards.

**Example**

```
Input: s = "babad"
Output: "bab"
```

Explanation: "bab" reads the same forwards and backwards and has length 3; "aba" is also a
valid length-3 palindrome in `s`, but "bab" is the one produced by expanding outward from
the center at index 1.

## Intuition

Checking all `O(n^2)` substrings for palindromicity is `O(n^3)`. The insight that kills the extra
factor is that a palindrome is built outward from its middle: if `s[l..r]` is a palindrome then
so is `s[l+1..r-1]`, and conversely you can grow a palindrome one character at a time as long as
the two ends match. So instead of enumerating substrings, enumerate the `2n - 1` possible centers
— `n` single characters for odd lengths, `n - 1` gaps between characters for even lengths — and
push outward from each until the characters stop matching.

## Approach

1. Track the best answer as `start` and `length` rather than slicing strings inside the loop;
   build the substring once at the end.
2. For each index `i`, try two centers: the odd center `(l, r) = (i, i)` and the even center
   `(l, r) = (i, i + 1)`.
3. Expand: `while l >= 0 and r < len(s) and s[l] == s[r]`, decrement `l` and increment `r`. The
   bounds check must come before the comparison.
4. When the loop stops, `l` and `r` have each overshot by one, so the palindrome found is
   `s[l+1 : r]` with length `r - l - 1`. This is the off-by-one to be careful about; it also
   gives `0` correctly for an even center whose two characters never matched.
5. If `r - l - 1 > length`, update `start, length = l + 1, r - l - 1`.
6. Return `s[start : start + length]`. A non-empty input always records at least a length-1
   palindrome on the first odd center, so there is no empty-answer case to guard.
7. The table version, if you want the DP framing: `dp[i][j]` is `True` iff `s[i..j]` is a
   palindrome, considering only that window; recurrence
   `dp[i][j] = (s[i] == s[j]) and (j - i < 2 or dp[i + 1][j - 1])`; base cases `dp[i][i] = True`
   and `dp[i][i + 1] = (s[i] == s[i + 1])`; iterate `i` **descending** with `j` ascending from
   `i`, so `dp[i + 1][j - 1]` is already filled; the answer is the widest `True` cell. Same
   `O(n^2)` time but `O(n^2)` space, which is why I write the expansion instead.

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

Every palindromic substring has a unique center — its middle character if the length is odd, the
gap between its two middle characters if even — so looping over all `2n - 1` centers considers
every candidate exactly once. From a fixed center the expansion is maximal: it stops only at a
mismatch or a boundary, and no longer palindrome can share that center, since trimming one
character off each of its sides would have to match at the position that just failed. Each of
the `2n - 1` centers expands at most `O(n)` steps for `O(n^2)` time, and only four scalars are
kept, so `O(1)` space.
