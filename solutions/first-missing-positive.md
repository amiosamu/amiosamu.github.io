---
# First Missing Positive · Hard · Arrays & Hashing
# https://leetcode.com/problems/first-missing-positive/
draft: false
pattern: "Cyclic sort, value to its own index"
time: "O(n)"
space: "O(1)"
---

## Description

Given an unsorted integer array `nums`, return the smallest positive integer that does not
appear in it. The solution must use linear time and constant auxiliary space.

**Example**

```
Input: nums = [3,4,-1,1]
Output: 2
```

Explanation: `1` is present, but `2` is not.

## Intuition

For an array of length `n`, the answer lies in `1..n + 1`. Values outside `1..n` cannot
affect which answer is smallest. The array itself can serve as a membership table by placing
each relevant value `v` at index `v - 1`.

After this in-place placement, index `i` contains `i + 1` exactly when that value exists.
The first mismatch identifies the answer. This process mutates `nums`.

## Approach

1. For each index `i`, repeatedly inspect `nums[i]` while it lies in `1..n` and is not
   already at its destination.
2. Set `j = nums[i] - 1` and swap `nums[i]` with `nums[j]`. The destination check prevents
   duplicate values from causing an infinite loop.
3. Scan the rearranged array. At the first index where `nums[i] != i + 1`, return `i + 1`.
4. If every index matches, all values `1..n` are present, so return `n + 1`.

## Code

```python
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)

        for i in range(n):
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                j = nums[i] - 1
                nums[i], nums[j] = nums[j], nums[i]

        for i in range(n):
            if nums[i] != i + 1:
                return i + 1

        return n + 1
```

## Why it works

Each swap places one in-range value at its unique destination. The destination guard ensures
that a correctly placed copy is never displaced by a duplicate, so there are at most `n`
successful placements. Afterward, a present value `v` in `1..n` must be at index `v - 1`;
therefore the first mismatching index represents the smallest absent positive. If there is
no mismatch, the pigeonhole bound leaves `n + 1` as the answer.

**Complexity**

- **Time:** `O(n)` because the total number of swaps and the final scan are linear.
- **Space:** `O(1)` auxiliary space; the algorithm mutates `nums`.
