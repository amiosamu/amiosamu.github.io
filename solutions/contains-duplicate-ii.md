---
# Contains Duplicate II · Easy · Sliding Window
# https://leetcode.com/problems/contains-duplicate-ii/
draft: false
pattern: "Hash map look backwards"
time: "O(n)"
space: "O(n)"
---

## Intuition

The brute force compares every pair `(i, j)` and checks `nums[i] == nums[j] and j - i <= k`, which is O(n²). The observation that kills it: for the current index `i`, only the *most recent* earlier occurrence of `nums[i]` can matter — if that one is already further than `k` away, every occurrence before it is further still. So one map from value to its last seen index is enough, and each index only ever looks backwards once.

## Approach

1. Keep a hashmap `mp` from value to the last index where that value appeared.
2. Iterate `i` over `range(len(nums))`.
3. Check if `nums[i]` is in `mp` and the difference between `i` and `mp[nums[i]]` is within `k`. If that's true return `True`.
4. Otherwise put the current index in the map: `mp[nums[i]] = i`. This overwrite is the whole trick — the older index is worthless once a nearer one exists.
5. Return `False` if after the for loop we could not return `True`.
6. Edge cases fall out for free: `k = 0` never satisfies `i - mp[...] <= k` for two distinct indices, and a single-element array never enters the `if`.

## Code

```python
class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        mp = {}
        for i in range(len(nums)):
            if nums[i] in mp and i - mp[nums[i]] <= k:
                return True
            mp[nums[i]] = i
        return False
```

## Why it works

The invariant is that when `i` is processed, `mp[v]` holds the largest index `j < i` with `nums[j] == v`, so `i - mp[nums[i]]` is the smallest possible gap ending at `i`. Any valid pair `(j, i)` has some rightmost such `j`, and that pair is tested exactly when the loop reaches `i` — so no answer is missed. One pass with O(1) hash operations gives O(n) time, and the map holds at most one entry per distinct value, O(n) space.
