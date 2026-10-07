---
# Guess Number Higher Or Lower · Easy · Binary Search
# https://leetcode.com/problems/guess-number-higher-or-lower/
draft: false
pattern: "Binary search over an oracle API"
time: "O(log n)"
space: "O(1)"
---

## Description

A hidden integer `pick` lies in `[1, n]`. The provided `guess(num)` API returns `-1` when
`num` is too high, `1` when it is too low, and `0` when it equals `pick`. Return `pick`.

**Example**

```
Input: n = 10, pick = 6
Output: 6
```

Explanation: `guess(6)` returns `0`, identifying the hidden number.

## Intuition

The API provides the same three-way comparison used by binary search. A negative result
discards the midpoint and everything above it; a positive result discards the midpoint and
everything below it. The sign is from the hidden number's perspective: `-1` means the
argument passed to `guess` is too high.

## Approach

1. Initialize the inclusive search range as `[l, r] = [1, n]`.
2. Call `guess(mid)` once for the range midpoint. Return `mid` when the result is zero.
3. If the result is negative, set `r = mid - 1`; the hidden number is lower.
4. Otherwise set `l = mid + 1`; the hidden number is higher.
5. The hidden number is guaranteed to exist, so the final `-1` is only a defensive return.

## Code

```python
class Solution:
    def guessNumber(self, n: int) -> int:
        l, r = 1, n
        while l <= r:
            mid = (l + r) // 2
            res = guess(mid)
            if res == 0:
                return mid
            if res < 0:
                r = mid - 1
            else:
                l = mid + 1
        return -1
```

## Why it works

Initially, `pick` is inside the search interval. The API result identifies which side of
`mid` contains it, so each update removes only values that cannot equal `pick` and preserves
the invariant. The interval strictly shrinks after every nonzero result. Because it always
contains the guaranteed answer, the loop must eventually call `guess` with `pick` and return
it.

**Complexity**

- **Time:** `O(log n)` API calls.
- **Space:** `O(1)` auxiliary space.
