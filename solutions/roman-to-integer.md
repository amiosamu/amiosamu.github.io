---
# Roman to Integer · Easy · Math & Geometry
# https://leetcode.com/problems/roman-to-integer/
draft: false
pattern: "Left-to-right scan, peek next symbol"
time: "O(n)"
space: "O(1)"
---

## Description

Given a valid Roman numeral string `s`, return its integer value. A symbol normally contributes
positively, but a smaller symbol immediately before a larger one contributes negatively.

**Example**

```
Input: s = "III"
Output: 3
```

Explanation: Each `I` contributes `1`, so the total is `1 + 1 + 1 = 3`.

## Intuition

In a valid Roman numeral, whether a symbol is added or subtracted is determined by its immediate
right neighbor. If that neighbor has a larger value, subtract the current symbol; otherwise add it.
This local rule handles every standard subtractive pair without listing those pairs separately.

## Approach

1. Map the seven Roman symbols to their integer values and initialize `total = 0`.
2. Scan each index `i`. If a next symbol exists and has greater value, subtract the current
   symbol's value.
3. Otherwise add the current value, including the final symbol, which has no right neighbor.
4. Return `total`.

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

For each position, the Roman numeral rules assign exactly one contribution: negative when the
next symbol is larger and positive otherwise. The algorithm applies that rule once to every symbol.
Summing those signed contributions is the standard value of the numeral, so `total` is correct when
the scan ends.

**Complexity**

- **Time:** `O(n)` for one pass over the numeral.
- **Space:** `O(1)` because the symbol table has seven entries.
