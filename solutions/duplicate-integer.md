---
# Contains Duplicate · Easy · Arrays & Hashing
# https://leetcode.com/problems/contains-duplicate/
draft: false
pattern: "Set membership"
time: "O(n)"
space: "O(n)"
---

## Description

Given an integer array `nums`, return whether any value appears more than once.

**Example**

```
Input: nums = [1,2,3,1]
Output: true
```

The value 1 appears at indices 0 and 3.

## Intuition

A set records values already encountered. Before inserting each value, test whether it is
present. A match proves a duplicate immediately; completing the scan without one proves all
values are distinct. The input list is only read, not sorted or otherwise mutated.

## Approach

1. Initialize an empty `seen` set.
2. For each value `x`, return `True` if `x` is already in `seen`.
3. Otherwise add `x` to `seen` and continue.
4. Return `False` after the loop because no equal pair was found. Empty and one-element
   inputs reach this case directly.

## Code

```python
class Solution:
    def hasDuplicate(self, nums: list[int]) -> bool:
        seen = set()

        for x in nums:
            if x in seen:
                return True
            seen.add(x)

        return False
```

## Why it works

Before processing index `i`, `seen` contains exactly the values at earlier indices. Thus a
successful membership test is precisely a pair of equal values at different indices. If
every test fails, every value differs from all values before it, so the array has no
duplicate.

**Complexity**

- **Time:** `O(n)` expected time for hash lookups and insertions.
- **Space:** `O(n)` for the set.
