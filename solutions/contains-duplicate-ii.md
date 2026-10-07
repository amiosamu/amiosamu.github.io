---
# Contains Duplicate II · Easy · Sliding Window
# https://leetcode.com/problems/contains-duplicate-ii/
draft: false
pattern: "Hash map look backwards"
time: "O(n)"
space: "O(n)"
---

## Description

Given `nums` and `k`, return whether two distinct indices contain equal values and differ by at
most `k`.

**Example**

```
Input: nums = [1,2,3,1], k = 3
Output: true
```

The equal values at indices 0 and 3 have distance 3, which is within `k`.

## Intuition

For the current index, only the most recent earlier occurrence of the same value matters. It
has the smallest possible distance; if it is too far away, every older occurrence is also too
far. Store that latest index in a hash map.

## Approach

1. Maintain `last`, mapping each value to its greatest processed index.
2. At index `i`, return `True` if `nums[i]` is in `last` and `i - last[nums[i]] <= k`.
3. Otherwise overwrite the value's entry with `i`; any older index can no longer produce a
   smaller gap for a future occurrence.
4. Return `False` after the scan. With `k == 0`, distinct indices can never qualify.

## Code

```python
class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        last = {}
        for i, value in enumerate(nums):
            if value in last and i - last[value] <= k:
                return True
            last[value] = i
        return False
```

## Why it works

Before index `i` is processed, `last[v]` is the greatest earlier index containing `v`.
Therefore `i - last[nums[i]]` is the minimum gap from `i` to an equal earlier value. Any valid
pair is detected when its right endpoint is processed. Updating the entry preserves the
invariant, so returning `False` means no qualifying pair exists.

**Complexity**

- **Time:** `O(n)` expected time for hash-map operations.
- **Space:** `O(n)` in the worst case for distinct values.
