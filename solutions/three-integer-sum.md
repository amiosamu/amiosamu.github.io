---
# 3Sum · Medium · Two Pointers
# https://leetcode.com/problems/3sum/
draft: false
pattern: "Sort, fix an anchor, two pointers"
time: "O(n^2)"
space: "O(n)"
---

## Description

Given `nums`, return every unique triplet of values at distinct indices whose sum is zero. The
result must not contain duplicate triplets.

**Example**

```
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
```

Both listed triplets sum to zero, and no other distinct value triplet does.

## Intuition

After sorting, fix one value and find the other two with inward-moving pointers. A sum that is too
small can only be increased by moving the left pointer; a sum that is too large can only be
decreased by moving the right pointer. Adjacent equal values can be skipped to avoid duplicate
triplets without a result set.

## Approach

1. Sort `nums` in place and iterate each possible anchor `i`.
2. Skip repeated anchors, and stop once `nums[i] > 0` because all later values are positive.
3. Search to the right of `i` with pointers `l` and `r`.
4. Move `l` right when the sum is too small and `r` left when it is too large.
5. On a zero sum, append the triplet, move both pointers, and skip repeated left values.

## Code

```python
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        n = len(nums)
        res = []

        for i in range(n - 2):
            if nums[i] > 0:
                break
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            l, r = i + 1, n - 1
            while l < r:
                total = nums[i] + nums[l] + nums[r]
                if total < 0:
                    l += 1
                elif total > 0:
                    r -= 1
                else:
                    res.append([nums[i], nums[l], nums[r]])
                    l += 1
                    r -= 1
                    while l < r and nums[l] == nums[l - 1]:
                        l += 1

        return res

```

## Why it works

For a fixed anchor, if the current sum is too small, its left value cannot pair with any remaining
right value because the current right value is the largest available; the symmetric argument
justifies moving the right pointer for a large sum. Thus each move discards only impossible pairs,
so the scan finds every zero-sum pair for that anchor. Every sorted triplet has one first value,
and skipping repeated first and second values emits each value triplet exactly once.

**Complexity**

- **Time:** `O(n^2)`; the `O(n log n)` sort is dominated by the pointer scans.
- **Space:** `O(n)` worst-case auxiliary space for Python's in-place sort, excluding output.
- **Output:** Up to `O(n^2)` triplets.
