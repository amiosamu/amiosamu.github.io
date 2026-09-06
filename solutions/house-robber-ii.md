---
# House Robber II · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/house-robber-ii/
draft: false
pattern: "Two linear House Robber runs on a circle"
time: "O(n)"
space: "O(n)"
---

## Intuition

The circle only adds one constraint over House Robber: houses `0` and `n - 1` are now adjacent,
so they cannot both be taken. Rather than build a DP that tracks whether the first house was
robbed, note that any valid circular selection omits at least one of the two endpoints. Cut the
circle at that omission and it becomes a plain line — so run the linear solver twice, once on
`nums[1:]` (first house banned) and once on `nums[:-1]` (last house banned), and take the better
result.

## Approach

1. Handle `len(nums) == 1` first and return `nums[0]`. Otherwise `nums[1:]` and `nums[:-1]`
   would both be empty and the answer would come out `0`.
2. Write the linear House Robber as a helper `robLine`. Its state: `dp[i]` is the maximum loot
   from the first `i` houses of the slice it was given, considering only that prefix.
3. Recurrence in the helper: `dp[i] = max(dp[i - 1], dp[i - 2] + nums[i - 1])` — skip this house
   and inherit, or rob it and add the prefix that stops two short.
4. Base cases: `dp[0] = 0`, `dp[1] = nums[0]`; in rolling form both are covered by seeding
   `rob1 = rob2 = 0`.
5. Iteration direction: left to right, sliding
   `rob1, rob2 = rob2, max(rob1 + n, rob2)`. Answer cell of the helper is `dp[n]`, returned as
   `rob2`.
6. Top level: return `max(robLine(nums[1:]), robLine(nums[:-1]))`.
7. There is no third case to worry about. A selection that omits both endpoints is already
   counted — twice, harmlessly — since it is legal in both slices.
8. The two slices cost O(n) space. Passing `(start, end)` indices into the helper instead of
   slicing brings it down to O(1) with the same recurrence, if you want it.

## Code

```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return nums[0]
        return max(self.robLine(nums[1:]), self.robLine(nums[:-1]))

    def robLine(self, nums: List[int]) -> int:
        rob1, rob2 = 0, 0

        for n in nums:
            rob1, rob2 = rob2, max(rob1 + n, rob2)

        return rob2
```

## Why it works

The two runs cover every legal circular selection: such a selection cannot contain both endpoint
houses, so it misses house `0`, house `n - 1`, or both, and is therefore feasible in at least one
of the two slices. Conversely nothing infeasible sneaks in — any selection valid on a slice is
non-adjacent on the line, and it is missing an endpoint, so wrapping the line back into a circle
creates no new adjacency. Each run is a linear O(n) scan with O(1) state; the O(n) space is the
two slices.
