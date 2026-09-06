---
# Search Insert Position · Easy · Binary Search
# https://leetcode.com/problems/search-insert-position/
draft: false
pattern: "Lower bound via binary search"
time: "O(log n)"
space: "O(1)"
---

## Description

Given a sorted array of distinct integers `nums` and a `target` value, return the index of `target` if it is found; otherwise return the index where it would be inserted to keep `nums` sorted. The solution must run in O(log n) time.

**Example**

```
Input: nums = [1,3,5,6], target = 5
Output: 2
```

Explanation: 5 already appears at index 2, so that index is returned directly.

## Intuition

This is not really "find the target" — it is "find the first index whose value is `>= target`", which answers both cases at once: if that element equals `target` it is the target's index, and if it does not, it is exactly where `target` belongs. That predicate, `nums[i] < target`, is monotone: true for a prefix of the array and false ever after. So I run the standard inclusive binary search and read the boundary off `l` instead of returning early on a hit.

## Approach

1. Search space: the index interval `[l, r]`, **inclusive on both ends**, with `l = 0`, `r = len(nums) - 1`.
2. Monotone predicate: `P(i) = nums[i] < target`. Because `nums` is sorted and strictly increasing, `P` is true on a prefix `[0, k)` and false on `[k, n)`; `k` is the answer.
3. Invariant maintained by the loop: every index `< l` satisfies `P`, and every index `> r` fails `P`.
4. Loop `while l <= r`, `mid = (l + r) // 2`.
5. If `nums[mid] < target`, `mid` is in the true-prefix, so the boundary is strictly right: `l = mid + 1`. Otherwise `mid` is a valid candidate boundary but maybe not the first: `r = mid - 1`.
6. Do **not** return early on `nums[mid] == target` — that is correct here only because values are distinct; keeping the pure boundary form makes the same code work for duplicates.
7. On exit `l == r + 1`, so `r` is the last index with `nums[r] < target` and `l` is the first index with `nums[l] >= target`. Return `l`.
8. Both edge cases fall out for free: `target` smaller than everything leaves `l = 0`; `target` larger than everything drives `l` to `n`, the append position.

## Code

```python
class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] < target:
                l = mid + 1
            else:
                r = mid - 1
        return l
```

## Why it works

The invariant "everything left of `l` is `< target` and everything right of `r` is `>= target`" is established trivially at the start (both regions empty) and preserved by each branch, since sortedness lets one probe classify a whole half. When the interval empties, those two regions are adjacent and `l` is exactly the split point between them, which is the definition of the insert position. The interval halves each step, so `O(log n)` time and `O(1)` space.
