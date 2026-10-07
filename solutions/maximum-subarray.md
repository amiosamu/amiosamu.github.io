---
# Maximum Subarray · Medium · Greedy
# https://leetcode.com/problems/maximum-subarray/
draft: false
pattern: "Kadane, drop negative prefixes"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array `nums`, return the largest sum of any non-empty contiguous subarray.

**Example**

```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
```

The subarray `[4,-1,2,1]` has the maximum sum, 6.

## Intuition

At each index, the best subarray ending there either starts at the current value or extends the
best subarray ending at the previous index. A negative previous sum cannot help an extension, so
the recurrence automatically discards it.

Tracking the best ending sum and the best sum seen so far reduces the search to one pass.

## Approach

1. Initialize `cur` and `best` to `nums[0]` so the chosen subarray cannot be empty.
2. For each later value `n`, set `cur = max(n, cur + n)`.
3. Update `best` with the new `cur`.
4. Return `best`; for an all-negative array, it remains the largest single value.

## Code

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        best = cur = nums[0]

        for n in nums[1:]:
            cur = max(n, cur + n)
            best = max(best, cur)

        return best
```

## Why it works

After index `i`, `cur` is the maximum sum of a subarray ending at `i`. This holds initially. By
induction, an ending subarray at the next index either consists of that value alone or extends a
subarray ending at `i`; extending the largest such sum is optimal. The recurrence compares exactly
those two possibilities. Since every non-empty subarray has a final index, taking the maximum of
all `cur` values makes `best` the global optimum.

**Complexity**

- **Time:** `O(n)` for one pass through `nums`.
- **Space:** `O(1)` auxiliary space.
