---
# Bitwise AND of Numbers Range · Medium · Bit Manipulation
# https://leetcode.com/problems/bitwise-and-of-numbers-range
draft: false
pattern: "Common binary prefix of left and right"
time: "O(log right)"
space: "O(1)"
---

## Description

Given two integers `left` and `right` with `left <= right`, return the bitwise AND of every
number in the inclusive range `[left, right]`.

**Example**

```
Input: left = 5, right = 7
Output: 4
```

Explanation: The range is 5 (101), 6 (110), 7 (111); ANDing all three together leaves only
the shared high bit, giving 4 (100).

## Intuition

A bit survives an AND only when it is set in every number in the range. The stable high bits are
exactly the common binary prefix of `left` and `right`; every lower position changes somewhere
between the endpoints and is zero in at least one value. Shift away differing suffix bits, then
restore the common prefix with zeros below it.

## Approach

1. Initialize `shift = 0`.
2. While the endpoints differ, right-shift both once and increment `shift`.
3. Equality means the remaining value is their common binary prefix.
4. Shift that prefix left by `shift` to restore its position with zeros in the removed suffix.
   Equal endpoints skip the loop; a range beginning at zero returns zero.

## Code

```python
class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        shift = 0
        while left < right:
            left >>= 1
            right >>= 1
            shift += 1
        return left << shift
```

## Why it works

All numbers between two endpoints share the endpoints' common prefix, so every `1` in that prefix
survives. If `s` suffix bits were removed, the highest removed bit is zero in `left` and one in
`right`; crossing that bit's boundary also includes a value whose lower removed bits are all
zero. Thus each removed position is zero in at least one range value and cannot survive the AND.
Restoring only the prefix therefore gives exactly the range AND.

**Complexity**

- **Time:** `O(log right)` shifts.
- **Space:** `O(1)`.
