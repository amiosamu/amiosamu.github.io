---
# Remove Element · Easy · Arrays & Hashing
# https://leetcode.com/problems/remove-element/
draft: false
pattern: "Slow write pointer, fast read"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array `nums` and value `val`, remove every occurrence of `val` in place. Return `k` so
that the first `k` positions contain the remaining values. Positions after that prefix are ignored.

**Example**

```
Input: nums = [3,2,2,3], val = 3
Output: 2, with nums = [2,2,_,_]
```

Explanation: Both `3`s are removed, leaving two `2`s in the checked prefix.

## Intuition

Physical deletion would repeatedly shift the suffix. Instead, compact values not equal to `val`
into the front of the same array. The write index `k` is both the number of kept values and the
position for the next one. It never passes the read position, so writing cannot destroy unread data.

## Approach

1. Initialize `k = 0`, the next output position.
2. Scan each value `x` in `nums`. When `x != val`, write it to `nums[k]` and increment `k`.
3. Skip matching values without moving `k`; a later kept value may overwrite that position.
4. Return `k`. The method mutates `nums`, preserves the kept values' order, and leaves the tail
   unspecified.

## Code

```python
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        k = 0

        for x in nums:
            if x != val:
                nums[k] = x
                k += 1

        return k
```

## Why it works

After processing any prefix, `nums[:k]` contains exactly that prefix's non-`val` values in their
original order. Skipping `val` preserves the claim. Writing any other value appends the next
required value, and `k` cannot overtake the read position. Thus no unread value is lost, and after
the scan the first `k` slots contain all and only the values to keep.

**Complexity**

- **Time:** `O(n)` for one pass.
- **Space:** `O(1)` auxiliary space.
