---
# 4Sum · Medium · Two Pointers
# https://leetcode.com/problems/4sum/
draft: false
pattern: "Sort, fix two, two-pointer the rest"
time: "O(n^3)"
space: "O(n)"
---

## Description

Given an integer array `nums` and an integer `target`, return every unique quadruplet whose
four distinct elements sum to `target`. The result must not contain duplicate quadruplets.

**Example**

```
Input: nums = [1,0,-1,0,-2,2], target = 0
Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
```

Each listed quadruplet uses four elements, sums to `0`, and appears only once.

## Intuition

After sorting, fix the first two values and solve a two-sum problem for the other two. A
two-pointer scan finds that pair in linear time because moving the left pointer increases the
sum and moving the right pointer decreases it. Sorting also places duplicates together, so
equal choices can be skipped without storing quadruplets in a set.

## Approach

1. Sort `nums` in place. Use `i` and `j` for the first two indices, skipping a value when
   the same loop already used it.
2. For each pair `(i, j)`, set `left = j + 1` and `right = n - 1`.
3. Compare the four-value `total` with `target`. Move `left` right for a small sum and
   `right` left for a large sum.
4. On equality, append the quadruplet, move both pointers, and skip adjacent duplicate values.
5. Return the collected results. If fewer than four values exist, no pointer scan runs.

The in-place sort mutates `nums`. The four indices always satisfy `i < j < left < right`, so
the same array element is never used twice.

## Code

```python
class Solution:
    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
        nums.sort()
        n = len(nums)
        res = []

        for i in range(n):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            for j in range(i + 1, n):
                if j > i + 1 and nums[j] == nums[j - 1]:
                    continue
                left, right = j + 1, n - 1
                while left < right:
                    total = nums[i] + nums[j] + nums[left] + nums[right]
                    if total == target:
                        res.append([nums[i], nums[j], nums[left], nums[right]])
                        left += 1
                        right -= 1
                        while left < right and nums[left] == nums[left - 1]:
                            left += 1
                        while left < right and nums[right] == nums[right + 1]:
                            right -= 1
                    elif total < target:
                        left += 1
                    else:
                        right -= 1

        return res
```

## Why it works

For fixed `i` and `j`, if the sum is too small, even the largest available right value cannot
make the current `left` work; advancing `left` is therefore safe. The symmetric argument
applies when the sum is too large. Thus the scan finds every valid remaining pair. Skipping an
equal value only removes a quadruplet already considered in the same position, so each value
combination is emitted once.

**Complexity**

- **Time:** `O(n^3)` after sorting, which is dominated by the two loops and pointer scan.
- **Space:** `O(n)` auxiliary space for Python's sort in the worst case, plus `O(q)` output
  space for `q` quadruplets.
