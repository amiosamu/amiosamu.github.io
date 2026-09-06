---
# 3Sum · Medium · Two Pointers
# https://leetcode.com/problems/3sum/
draft: false
pattern: "Sort, fix an anchor, two pointers"
time: "O(n^2)"
space: "O(1)"
---

## Description

Given an integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` with distinct indices `i`, `j`, `k` whose values sum to 0. The result must not contain duplicate triplets.

**Example**

```
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
```

Explanation: `-1 + -1 + 2 == 0` and `-1 + 0 + 1 == 0`; every other combination of three values either repeats one of these triplets or does not sum to zero.

## Intuition

Fixing the first number turns 3Sum into "find two numbers summing to `-nums[i]`" — and once the
array is sorted, that inner problem is the O(n) two-pointer walk from Two Sum II. That is O(n²)
total instead of O(n³). Sorting also solves the harder half of this problem, which is deduplicating
the *triplets*: equal values become adjacent, so a duplicate triplet can only come from re-picking a
value that is identical to the one just used at the same position. Skip those and no set of tuples
is needed.

## Approach

1. Sort `nums` in place and let `n = len(nums)`, `res = []`.
2. Loop the anchor `i` over `range(n - 2)`. If `nums[i] > 0`, `break` — the array is sorted, so all
   three picks are positive and no later anchor can sum to zero.
3. Skip a duplicate anchor: `if i > 0 and nums[i] == nums[i - 1]: continue`. The guard `i > 0` is
   essential; without it the first element is compared against `nums[-1]`.
4. Set `l = i + 1`, `r = n - 1` and walk inward while `l < r`, computing
   `total = nums[i] + nums[l] + nums[r]`.
5. If `total < 0` move `l` right — `nums[r]` is already the largest partner left for `l`, so `l` is
   too small for anything in the window and moving `r` left would only shrink the sum further. If
   `total > 0` move `r` left by the mirror argument.
6. On `total == 0`, append `[nums[i], nums[l], nums[r]]`, then move **both** pointers (moving only
   one can never give another zero with the same anchor), then skip duplicates on the left:
   `while l < r and nums[l] == nums[l - 1]: l += 1`. Skipping on one side is enough — a repeated
   left value with a fresh right value would not sum to zero anyway.
7. Return `res`.

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

Every triplet has a smallest element, so anchoring on each distinct value of `nums[i]` and searching
only to its right covers all of them exactly once, with no ordering ambiguity. Inside, the
two-pointer scan is complete for the same exchange reason as Two Sum II: each move eliminates an
index that has been proven to fail against every partner remaining in the window. The two skip rules
mean each distinct triplet is emitted once — the anchor skip kills duplicate first elements, the
inner skip kills duplicate second elements, and the third is then determined. Sorting is O(n log n),
dominated by n anchors times an O(n) scan, so O(n²) time with only index variables beyond the
in-place sort and the output.
