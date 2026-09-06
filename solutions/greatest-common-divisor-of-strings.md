---
# Greatest Common Divisor of Strings · Easy · Math & Geometry
# https://leetcode.com/problems/greatest-common-divisor-of-strings/
draft: false
pattern: "Concatenation test, then gcd of lengths"
time: "O(n + m)"
space: "O(n + m)"
---

## Intuition

If some string `t` divides both, then `str1` is `t` repeated `a` times and `str2` is `t` repeated
`b` times, so `str1 + str2` and `str2 + str1` are both just `t` repeated `a + b` times — they must
be equal. The converse also holds, so `str1 + str2 == str2 + str1` is a complete test for "a
common divisor exists at all". Once I know one exists, every divisor's length divides both
`len(str1)` and `len(str2)`, so the longest possible is `gcd` of the two lengths, and the prefix of
that length is forced (any divisor is a prefix of `str1`).

## Approach

1. If `str1 + str2 != str2 + str1`, return `""`. Nothing else in the function has to worry about
   mismatched content after this line.
2. Otherwise compute `g = gcd(len(str1), len(str2))` with an inline Euclid loop:
   `while b: a, b = b, a % b`, then return `a`.
3. Return `str1[:g]`.
4. No divisibility re-check is needed at the end: step 1 already guarantees both strings are
   repetitions of a common unit, and step 2 picks the largest length compatible with both.
5. Edge cases: `str1 == str2` gives `g == len(str1)` and returns the whole string. Strings of
   coprime lengths like `"ABABAB"` and `"ABAB"` give `g == gcd(6, 4) == 2` -> `"AB"`.
   `"LEET"` / `"CODE"` fails the concatenation test and returns `""`.

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

`str1 + str2 == str2 + str1` says the two strings commute, and commuting strings over a free
monoid are both powers of a single common string — that is the theorem doing all the work here.
Given that, the set of valid divisor lengths is exactly the common divisors of the two lengths, so
`gcd` is the maximum, and the divisor of that length must be `str1`'s prefix since `str1` starts
with it. Building the two concatenations costs `O(n + m)` time and space; Euclid on the lengths
adds only `O(log min(n, m))`.
