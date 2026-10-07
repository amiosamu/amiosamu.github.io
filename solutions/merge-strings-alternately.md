---
# Merge Strings Alternately · Easy · Two Pointers
# https://leetcode.com/problems/merge-strings-alternately/
draft: false
pattern: "Lockstep pointers, then append the tail"
time: "O(n + m)"
space: "O(n + m)"
---

## Description

Given `word1` and `word2`, create a string by alternating their characters, starting with `word1`.
After one word is exhausted, append the remainder of the other.

**Example**

```
Input: word1 = "abc", word2 = "pqr"
Output: "apbqcr"
```

The characters are appended in the order `a, p, b, q, c, r`.

## Intuition

Advance one index through each word in lockstep, appending the character from `word1` before the
character from `word2`. Once either word ends, alternation is complete and the remaining suffix can
be appended directly.

A list buffer avoids repeated immutable-string concatenation; one final `join` builds the result.

## Approach

1. Initialize output list `res` and indices `i = j = 0`.
2. While both words have characters, append `word1[i]` and then `word2[j]`; advance both indices.
3. Append both remaining slices. At least one is empty, so this adds only the unconsumed suffix.
4. Join the pieces and return the resulting string.

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

After `k` loop iterations, `i == j == k` and `res` contains the first `k` characters of each word
in the required alternating order. Appending the next pair preserves this invariant. The loop stops
exactly when no further pair exists, and the required continuation is the sole non-empty suffix.
Thus every character appears once and in the specified order.

**Complexity**

- **Time:** `O(n + m)` to append and join all characters.
- **Space:** `O(n + m)` for the construction buffer and returned string.
