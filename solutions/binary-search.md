---
# Binary Search · Easy · Binary Search
# https://leetcode.com/problems/binary-search/
draft: false
pattern: "Classic binary search, inclusive bounds"
time: "O(log n)"
space: "O(1)"
---

## Description

Given a sorted array of distinct integers, return the index of `target`, or `-1` if it is absent.

**Example**

```
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
```

Explanation: `nums[4] == 9`, so index 4 is returned.

## Intuition

Sorted order lets one middle comparison discard half of the remaining indices. Inclusive bounds
make the search space explicit: while `left <= right`, every index where the target could still
occur remains inside `[left, right]`.

## Approach

1. Initialize the inclusive search interval with `l = 0` and `r = len(nums) - 1`.
2. While it is non-empty, inspect `mid = (l + r) // 2` and return it on equality.
3. If `nums[mid] < target`, set `l = mid + 1`; otherwise set `r = mid - 1`.
4. Return `-1` when the interval becomes empty. This also handles an empty input array.

## Code

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                l = mid + 1
            else:
                r = mid - 1
        return -1
```

## Why it works

The invariant is that the target's index, if it exists, lies in `[l, r]`. Sortedness proves that
the discarded half cannot contain the target, so each update preserves the invariant. Both
updates exclude `mid`, making progress. If the interval empties, the invariant implies the target
does not exist.

**Complexity**

- **Time:** `O(log n)`.
- **Space:** `O(1)`.
