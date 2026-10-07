---
# Longest Turbulent Subarray · Medium · Greedy
# https://leetcode.com/problems/longest-turbulent-subarray/
draft: false
pattern: "Two run lengths, up and down"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array `arr`, return the length of the longest turbulent subarray, one where
the comparison sign between each pair of adjacent elements strictly alternates between
greater-than and less-than at every step.

**Example**

```
Input: arr = [9,4,2,10,7,8,8,1,9]
Output: 5
```

The subarray `[4,2,10,7,8]` alternates as `4 > 2 < 10 > 7 < 8`, so its length is 5.

## Intuition

A turbulent run ending at `i` is determined by its final comparison. An upward comparison can
extend only a run whose previous comparison was downward, and a downward comparison can extend
only an upward run.

Track the best ending length for each final direction. Equal adjacent values break both kinds of
run, so both lengths reset to one.

## Approach

1. Initialize `up = down = best = 1`; one element is a valid turbulent subarray.
2. For an increase, set `up` to the previous `down + 1` and reset `down` to `1`.
3. For a decrease, set `down` to the previous `up + 1` and reset `up` to `1`.
4. For equal neighbors, reset both lengths to `1`, then update `best` from both states.

## Code

```python
class Solution:
    def maxTurbulenceSize(self, arr: List[int]) -> int:
        best = 1
        up = down = 1

        for i in range(1, len(arr)):
            if arr[i] > arr[i - 1]:
                up, down = down + 1, 1
            elif arr[i] < arr[i - 1]:
                down, up = up + 1, 1
            else:
                up = down = 1
            best = max(best, up, down)

        return best
```

## Why it works

After processing index `i`, `up` and `down` are the longest turbulent subarrays ending at `i` with
an upward or downward final comparison, respectively. The claim holds at index `0`. For an upward
step, only a downward-ending run can be extended, giving the old `down + 1`; the downward state
cannot cross that step and resets. The other case is symmetric, and equality resets both states.
Thus the invariant holds by induction. Every turbulent subarray ends at some index in one of these
states, so `best` sees the global optimum.

**Complexity**

- **Time:** `O(n)` for one pass through `arr`.
- **Space:** `O(1)` auxiliary space.
