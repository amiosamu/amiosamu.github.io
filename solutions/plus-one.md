---
# Plus One · Easy · Math & Geometry
# https://leetcode.com/problems/plus-one/
draft: false
pattern: "In-place digit carry from the right"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array `digits` representing a nonnegative integer from most significant digit to least,
add one and return the resulting digit array.

**Example**

```
Input: digits = [1,2,3]
Output: [1,2,4]
```

Explanation: The input represents `123`, and `123 + 1 = 124`.

## Intuition

Adding one affects only the trailing run of `9`s and, if present, the digit immediately before
that run. Scan from right to left, turning each trailing `9` into `0`. The first smaller digit
absorbs the carry; if none exists, the result needs a new leading `1`.

## Approach

1. Scan indices from `len(digits) - 1` down to `0`.
2. If `digits[i] < 9`, increment that digit in place and return immediately because the carry
   has been resolved.
3. Otherwise set `digits[i] = 0` and continue carrying left.
4. If every digit was `9`, return `[1] + digits`; the input has already become all zeros.

The method mutates `digits`. Except for the all-`9`s case, the returned object is the original
list.

## Code

```python
class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        n = len(digits)
        for i in range(n - 1, -1, -1):
            if digits[i] < 9:
                digits[i] += 1
                return digits
            digits[i] = 0
        return [1] + digits
```

## Why it works

Every processed `9` is the next digit reached by the carry, and replacing it with `0` is exactly
decimal rollover. If the scan finds a digit below `9`, incrementing it resolves the carry while
all more significant digits remain unchanged. If the scan finishes, every original digit was
`9`, so the value is one followed by `n` zeros. These are all possible carry outcomes, making the
returned representation correct.

**Complexity**

- **Time:** `O(n)` in the all-`9`s case and at most one visit per digit.
- **Space:** `O(1)` auxiliary space; the all-`9`s output requires a new `O(n)` list.
