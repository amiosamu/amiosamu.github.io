---
# Contains Duplicate · Easy · Arrays & Hashing
# https://leetcode.com/problems/contains-duplicate/
draft: false
pattern: "Set membership"
time: "O(n)"
space: "O(n)"
---

## Intuition

A duplicate exists exactly when the array has fewer distinct values than elements —
that is the one-liner `len(set(nums)) < len(nums)`. The streaming version is worth
writing out because it can exit early: the moment a repeat shows up there is nothing
left to learn, so the rest of the array never gets read.

## Approach

1. Keep a `seen` set of the values already passed.
2. For each `x` in `nums`, check `x in seen` **before** inserting — if it's there, return `True`.
3. Otherwise `seen.add(x)` and continue.
4. If the loop finishes, every value was distinct, so return `False`.
5. Alternative: sort first and compare adjacent pairs. That drops the extra space to `O(1)`
   (ignoring the sort's own stack) but costs `O(n log n)` time. The set trade is usually
   the one worth making.

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

The loop invariant is that `seen` holds exactly the elements at indices `< i`, so the
membership test at index `i` asks precisely "does `nums[i]` equal an earlier element?" —
which is the definition of a duplicate. If no index ever answers yes, no pair anywhere
in the array is equal. Each element costs one `O(1)` hash lookup and at most one insert,
so it is `O(n)` time (often far less, since it returns on the first repeat) and `O(n)`
space for the set.
