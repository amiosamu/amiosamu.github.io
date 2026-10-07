---
# House Robber · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/house-robber/
draft: false
pattern: "Take-or-skip DP, two rolling variables"
time: "O(n)"
space: "O(1)"
---

## Description

Given money in houses arranged in a line, return the maximum amount that can be robbed
without choosing two adjacent houses.

**Example**

```
Input: nums = [1,2,3,1]
Output: 4
```

Explanation: Robbing houses `0` and `2` gives `1 + 3 = 4`.

## Intuition

For each house, an optimal plan either skips it and keeps the previous optimum, or robs it
and adds its value to the optimum ending two positions earlier. This gives the recurrence
`dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])`.

Only the previous two states are needed, so the full table can be replaced with two rolling
variables.

## Approach

1. Initialize `rob1 = rob2 = 0`, representing the optima for the two prefixes before the
   first house.
2. For each amount `n`, compute the better of robbing it (`rob1 + n`) and skipping it
   (`rob2`).
3. Simultaneously assign `rob1, rob2 = rob2, best` so both values come from the previous
   iteration.
4. Return `rob2`. The same loop handles an empty list and a single house, and it does not
   mutate `nums`.

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

For any prefix, every valid selection either excludes its last house or includes it. The
first case has value at most the previous prefix optimum. The second must exclude the
previous house, so its value is the current amount plus the optimum two prefixes back.
These exhaustive cases establish the recurrence by induction. The rolling variables store
exactly those two required states, so the returned value is the full-prefix optimum.

**Complexity**

- **Time:** `O(n)` for one pass through the houses.
- **Space:** `O(1)` auxiliary space.
