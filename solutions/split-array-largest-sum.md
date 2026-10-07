---
# Split Array Largest Sum · Hard · Binary Search
# https://leetcode.com/problems/split-array-largest-sum/
draft: false
pattern: "Binary search on the answer"
time: "O(n log(sum(nums)))"
space: "O(1)"
---

## Description

Given nonnegative integers `nums` and integer `k`, split `nums` into `k` nonempty contiguous
subarrays. Return the smallest possible value of the largest subarray sum.

**Example**

```
Input: nums = [7,2,5,10,8], k = 2
Output: 18
```

Explanation: `[7,2,5]` and `[10,8]` have sums `14` and `18`, and no split has a smaller
maximum.

## Intuition

Binary-search a candidate maximum `cap`. Feasibility is monotone: if a split works for one cap,
it also works for every larger cap. For a fixed cap, greedily extend the current subarray until
the next value would exceed it, then start a new one. Because values are nonnegative, delaying
each cut uses the fewest possible subarrays.

## Approach

1. Let `subarrays(cap)` greedily count parts, cutting just before adding a value would exceed
   `cap`.
2. Search candidate caps from `max(nums)` to `sum(nums)`, inclusive. These are the smallest
   possible lower bound and a feasible upper bound.
3. If `subarrays(mid) <= k`, keep the lower half because `mid` is feasible; otherwise keep the
   upper half.
4. Return the first feasible cap. A solution using fewer than `k` parts can be split further
   into exactly `k` nonempty parts without increasing any sum.

## Code

```python
class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        def subarrays(cap: int) -> int:
            count, cur = 1, 0
            for x in nums:
                if cur + x > cap:
                    count += 1
                    cur = 0
                cur += x
            return count

        l, r = max(nums), sum(nums)
        while l <= r:
            mid = (l + r) // 2
            if subarrays(mid) <= k:
                r = mid - 1
            else:
                l = mid + 1
        return l
```

## Why it works

For a fixed cap, consider each greedy cut. Any valid partition must cut no later: including the
next nonnegative value would exceed the cap. Inductively, after every greedy part, no other valid
partition can have consumed more input with fewer parts. Greedy therefore uses the minimum
number of parts, so `subarrays(cap) <= k` is equivalent to feasibility. Feasibility remains true
as cap increases, and binary search returns its first true value, the optimum.

**Complexity**

- **Time:** `O(n log S)`, where `S = sum(nums) - max(nums) + 1` is the candidate range size.
- **Space:** `O(1)` auxiliary space.
