---
# Roman to Integer · Easy · Math & Geometry
# https://leetcode.com/problems/roman-to-integer/
draft: false
pattern: "Left-to-right scan, peek next symbol"
time: "O(n)"
space: "O(1)"
---

## Description

Given a string `s` representing a roman numeral, convert it to its integer value. Symbols
normally add together left to right, but a smaller-value symbol placed immediately before a
larger one is subtracted instead (e.g. `IV` means `5 - 1`).

**Example**

```
Input: s = "III"
Output: 3
```

Explanation: Each symbol is `I`, worth 1, and none precedes a larger symbol, so the three
values simply add: 1 + 1 + 1 = 3.

## Intuition

Reading left to right, a smaller-value symbol placed just before a larger one signals
subtraction (`IV` is `5 - 1`); every other symbol simply adds its own value. That means a single
pass that peeks at the next symbol is enough - no need to hardcode all six subtractive pairs
(`IV`, `IX`, `XL`, `XC`, `CD`, `CM`) as special cases.

## Approach

1. Build `values`, a dict mapping each symbol to its integer value:
   `I=1, V=5, X=10, L=50, C=100, D=500, M=1000`.
2. Initialize `total = 0`.
3. Iterate `i` over every index of `s`.
4. If `i + 1` is a valid index and `values[s[i]] < values[s[i+1]]`, the current symbol is being
   used subtractively (like the `I` in `IV`): subtract `values[s[i]]` from `total`.
5. Otherwise, add `values[s[i]]` to `total`.
6. Return `total` after the loop finishes.

## Code

```python
class Solution:
    def romanToInt(self, s: str) -> int:
        values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
        total = 0
        for i in range(len(s)):
            if i + 1 < len(s) and values[s[i]] < values[s[i + 1]]:
                total -= values[s[i]]
            else:
                total += values[s[i]]
        return total
```

## Why it works

Every valid roman numeral places a smaller symbol before a larger one only when it's meant to
subtract, and that pattern never spans more than two adjacent symbols - so comparing each symbol
only to its immediate right neighbor is enough to tell the two cases apart. The pass touches
each symbol once and the values dict is a fixed constant size, giving `O(n)` time and `O(1)`
space.
