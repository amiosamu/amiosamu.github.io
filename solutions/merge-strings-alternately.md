---
# Merge Strings Alternately · Easy · Two Pointers
# https://leetcode.com/problems/merge-strings-alternately/
draft: false
pattern: "Lockstep pointers, then append the tail"
time: "O(n + m)"
space: "O(1)"
---

## Description

Given two strings `word1` and `word2`, build a new string by taking characters alternately, starting with `word1`; once one string is exhausted, append the remaining characters of the other.

**Example**

```
Input: word1 = "abc", word2 = "pqr"
Output: "apbqcr"
```

Explanation: Characters alternate a, p, b, q, c, r — one from each string in turn — and both strings run out at the same time, so nothing is left to append.

## Intuition

Two cursors that advance in lockstep, one per string, and the only real question is what happens
when the shorter string runs out. Once one cursor is exhausted there is nothing left to alternate
with, so the rest of the longer string is appended verbatim. Building the answer with `str +=` in a
loop is quadratic in Python, so collect the pieces in a list and `"".join` once at the end.

## Approach

1. Keep a list `res` for the output pieces and two indices `i = j = 0`, one into `word1` and one
   into `word2`.
2. While `i < len(word1)` and `j < len(word2)`: append `word1[i]`, then `word2[j]`, then advance
   both. Both pointers move forward only, in the same direction and at the same rate — the output
   position is `i + j`, so falling behind on either one would break the alternation.
3. When the loop exits, at least one cursor is at the end of its string. Append the slices
   `word1[i:]` and `word2[j:]` — one of them is guaranteed empty, so no `if` is needed.
4. Return `"".join(res)`.
5. Order matters: `word1` first in every pair and in the tail, since the problem starts with
   `word1`.

## Code

```python
class Solution:
    def mergeAlternately(self, word1: str, word2: str) -> str:
        res = []
        i = j = 0
        while i < len(word1) and j < len(word2):
            res.append(word1[i])
            res.append(word2[j])
            i += 1
            j += 1
        res.append(word1[i:])
        res.append(word2[j:])
        return "".join(res)
```

## Why it works

The loop invariant is `i == j` throughout, so after k iterations the output holds the first k
characters of each string correctly interleaved; the loop stops exactly when the shorter string is
consumed, which is precisely where alternation is no longer defined and the spec says to append the
remainder. Every character of both strings is appended exactly once, so the work is O(n + m), and
apart from the buffer that becomes the returned string the algorithm holds only two integers.
