---
# Greatest Common Divisor of Strings · Easy · Math & Geometry
# https://leetcode.com/problems/greatest-common-divisor-of-strings/
draft: false
pattern: "Concatenation test, then gcd of lengths"
time: "O(n + m)"
space: "O(n + m)"
---

## Description

Given strings `str1` and `str2`, return the longest string that can be repeated to form
each input exactly. Return `""` if no such string exists.

**Example**

```
Input: str1 = "ABCABC", str2 = "ABC"
Output: "ABC"
```

Explanation: Repeating `"ABC"` twice forms `str1`, and repeating it once forms `str2`.

## Intuition

If both strings consist of repetitions of the same unit, concatenating them in either order
produces the same sequence. The equality `str1 + str2 == str2 + str1` is also sufficient:
it means both strings share one repeating primitive pattern.

Any common divisor string has a length dividing both input lengths. The greatest possible
length is therefore their numeric greatest common divisor, and its content must be the
corresponding prefix of `str1`.

## Approach

1. Compare `str1 + str2` with `str2 + str1`. Return `""` if they differ.
2. Apply Euclid's algorithm to the two lengths; after the loop, `a` is their greatest
   common divisor.
3. Return `str1[:a]`. This slice allocates the returned divisor string.
4. Equal strings return the entire string, while incompatible content fails at step 1.

## Code

```python
class Solution:
    def gcdOfStrings(self, str1: str, str2: str) -> str:
        if str1 + str2 != str2 + str1:
            return ""
        a, b = len(str1), len(str2)
        while b:
            a, b = b, a % b
        return str1[:a]
```

## Why it works

If a common divisor exists, both concatenation orders are repetitions of it and are equal.
Conversely, equality of the concatenations forces both strings to have the same repeating
pattern, so a common divisor exists. Its length must divide both input lengths; choosing
their greatest common divisor gives the longest valid length. Since every divisor starts
`str1`, the prefix of that length is the required string.

**Complexity**

- **Time:** `O(n + m)` for concatenation comparison and the returned slice.
- **Space:** `O(n + m)` for the temporary concatenated strings in Python.
