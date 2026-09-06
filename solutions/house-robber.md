---
# House Robber · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/house-robber/
draft: false
pattern: "Take-or-skip DP, two rolling variables"
time: "O(n)"
space: "O(1)"
---

## Intuition

The greedy "always take the bigger neighbour" idea dies on `[2, 1, 1, 2]` — you must skip two
adjacent-to-nothing houses in the middle to take both ends. The structural fact is that after
deciding houses `0..i`, the only thing the future needs to know is the best total you can have
*ending at or before* `i`, split by whether house `i` itself was taken. Robbing house `i` forces
skipping `i - 1`, so `dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])` — take or skip, two cells
back.

## Approach

1. State: `dp[i]` is the maximum loot obtainable from the first `i` houses, `nums[0..i-1]`,
   considering only that prefix. Indexing by *count* rather than position keeps the base cases
   free of negative indices.
2. Recurrence: `dp[i] = max(dp[i - 1], dp[i - 2] + nums[i - 1])` — either skip house `i - 1` and
   inherit the best from the shorter prefix, or rob it and add the best prefix that stops two
   houses short.
3. Base cases: `dp[0] = 0` (no houses, no loot) and `dp[1] = nums[0]`. With the rolling form
   below both collapse to seeding a pair of zeros.
4. Iteration direction: increasing `i` — left to right over `nums`.
5. Answer: `dp[n]`.
6. Rolling form: keep `rob1 = dp[i - 2]` and `rob2 = dp[i - 1]`, both starting at `0`. For each
   `n` in `nums`, do `rob1, rob2 = rob2, max(rob1 + n, rob2)`. The simultaneous assignment is
   load-bearing — computing `rob2` first would feed the stale `rob1` into the wrong slot.
7. Return `rob2`. The empty-array and single-house cases fall out of the same loop with no
   special casing.

## Code

```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        rob1, rob2 = 0, 0

        for n in nums:
            rob1, rob2 = rob2, max(rob1 + n, rob2)

        return rob2
```

## Why it works

Every valid selection over the first `i` houses either omits house `i - 1`, in which case it is
a valid selection over the first `i - 1`, or includes it, in which case it omits `i - 2` and its
remainder is a valid selection over the first `i - 2` — the two branches are exhaustive and
non-overlapping, so maximizing over both is correct. Because all the loot values are
non-negative, `dp` is non-decreasing and `dp[n]` is the global best, not just the best ending at
the last house. One pass, two scalars: O(n) time, O(1) space.
