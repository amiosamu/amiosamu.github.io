---
# Two Sum · Easy · Arrays & Hashing
# https://leetcode.com/problems/two-sum/
draft: false
pattern: "Hash map complement lookup"
time: "O(n)"
space: "O(n)"
---

## Description

Given an array of integers `nums` and an integer `target`, return the indices of the two
numbers that add up to `target`. Exactly one valid pair is guaranteed to exist, the same
element cannot be used twice, and the two indices may be returned in either order.

**Example**

```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
```

The values at indices `0` and `1` sum to `9`.

## Intuition

For each value `x`, the required partner is `target - x`. A hash map of previously visited values
answers whether that partner exists in expected constant time, reducing pair search to one pass.

## Approach

1. Keep `seen`, mapping each previously visited value to its index.
2. For each `nums[i]`, compute `complement = target - nums[i]`.
3. If the complement is present, return its stored index and `i`.
4. Otherwise store the current value after checking, which prevents an element matching itself.
5. Retain a defensive empty return although the input guarantees one valid pair.

## Code

```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen: dict[int, int] = {}

        for i, x in enumerate(nums):
            complement = target - x
            if complement in seen:
                return [seen[complement], i]
            seen[x] = i

        return []
```

## Why it works

Before iteration `i`, the invariant is that `seen` contains values from exactly the processed
prefix. For any valid pair with earlier index `j` and later index `i`, `nums[j]` is therefore in
`seen` when `i` is processed, so the lookup finds it. Conversely, every returned index comes from
the earlier prefix and its value is the current complement, proving the indices are distinct and
their values sum to `target`.

**Complexity**

- **Time:** `O(n)` expected time for hash-map operations.
- **Space:** `O(n)` in the worst case for `seen`.
