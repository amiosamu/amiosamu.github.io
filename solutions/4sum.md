---
# 4Sum · Medium · Two Pointers
# https://leetcode.com/problems/4sum/
draft: false
pattern: "Sort, fix two, two-pointer the rest"
time: "O(n^3)"
space: "O(n)"
---

## Description

Given an integer array `nums` and an integer `target`, return all unique quadruplets `[nums[a], nums[b], nums[c], nums[d]]` with four distinct indices whose values sum to `target`. The result must not contain duplicate quadruplets.

**Example**

```
Input: nums = [1,0,-1,0,-2,2], target = 0
Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
```

Explanation: For example `-2 + -1 + 1 + 2 == 0` and `-2 + 0 + 0 + 2 == 0`; each listed quadruplet sums to the target and no duplicate combination is repeated.

## Intuition

The brute force enumerates all four indices, O(n⁴). The insight is that a quadruple is really "two fixed values plus a 2Sum": once `nums[i]` and `nums[j]` are pinned, the remaining pair must sum to `target - nums[i] - nums[j]`, and on a *sorted* array that pair is found by a two-pointer sweep in O(n) instead of O(n²). Sorting also makes duplicates adjacent, so the only way to produce a repeated quadruple is to reuse the same value at the same position — skipping equal neighbours at each of the four slots is enough to dedupe without a set.

## Approach

1. Sort `nums` and let `n = len(nums)`; collect answers in `res`.
2. Outer loop `i` over `range(n)`. If `i > 0 and nums[i] == nums[i - 1]`, `continue` — that value was already used as the first element.
3. Inner loop `j` over `range(i + 1, n)`. If `j > i + 1 and nums[j] == nums[j - 1]`, `continue` — same skip, but guarded against `i + 1` so the *first* choice of `j` is never skipped.
4. With `i` and `j` fixed, set `left, right = j + 1, n - 1` and sweep while `left < right`.
5. Compute `total = nums[i] + nums[j] + nums[left] + nums[right]`. If `total < target` move `left` up (only a bigger value can help); if `total > target` move `right` down; if equal, record the quadruple.
6. After recording a hit, move both pointers inward once, then advance `left` while `nums[left] == nums[left - 1]` and pull `right` back while `nums[right] == nums[right + 1]`. Both dedupe loops must re-check `left < right` so they cannot cross.
7. Return `res`. Nothing special is needed for `n < 4` — the loops just never reach a valid `left < right`.

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

On a sorted array the two-pointer sweep is complete: when `total < target`, `nums[right]` is the largest value still available to pair with `nums[left]`, so no partner for `left` exists and discarding `left` loses nothing — the mirror argument covers `total > target`. Because `i < j < left < right` the four indices are always distinct, and the four "skip equal neighbour" rules mean each distinct *value combination* is generated exactly once, so `res` needs no post-filtering. The two outer loops are O(n²) and each inner sweep is O(n), giving O(n³); the only extra space is the sort's scratch, O(n), since `res` is the output.
