---
# House Robber II · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/house-robber-ii/
draft: false
pattern: "Two linear House Robber runs on a circle"
time: "O(n)"
space: "O(n)"
---

## Description

Given money in houses arranged in a circle, return the maximum amount that can be robbed
without choosing adjacent houses. The first and last houses are adjacent.

**Example**

```
Input: nums = [2,3,2]
Output: 3
```

Explanation: Houses `0` and `2` are adjacent around the circle, so robbing house `1` alone
gives the maximum amount.

## Intuition

Any valid selection omits either the first house or the last house because those endpoints
are adjacent. Removing one endpoint turns the remaining houses into a line.

Solve the linear House Robber problem for `nums[1:]` and `nums[:-1]`, then take the larger
result. A one-house input needs separate handling because both slices would be empty.

## Approach

1. Return `nums[0]` when there is one house.
2. In `robLine`, let `rob1` and `rob2` represent the best totals two and one positions
   before the current house.
3. For each amount, update them to skip the house (`rob2`) or rob it (`rob1 + amount`).
4. Run the helper on `nums[1:]` and `nums[:-1]`, then return the larger result.
5. Both slices allocate new lists in Python; the function does not mutate `nums`.

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

Every legal circular selection excludes at least one endpoint, so it appears in one of the
two linear subproblems. Conversely, a nonadjacent selection from either slice excludes one
endpoint, so joining the line into a circle creates no selected endpoint pair. The maximum
of the two linear optima is therefore exactly the circular optimum. Within `robLine`, the
take-or-skip recurrence examines both possibilities for each final house and is correct by
induction on the processed prefix.

**Complexity**

- **Time:** `O(n)` across the two linear scans.
- **Space:** `O(n)` for the two Python slices; each helper uses `O(1)` additional state.
