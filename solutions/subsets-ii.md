---
# Subsets II · Medium · Backtracking
# https://leetcode.com/problems/subsets-ii/
draft: false
pattern: "Sort then skip equal siblings"
time: "O(n * 2^n)"
space: "O(n)"
---

## Description

Given an integer array `nums` that may contain duplicates, return its power set without duplicate
subsets.

**Example**

```
Input: nums = [1,2,2]
Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
```

Explanation: Although `2` occurs twice, value-identical subsets such as `[2]` appear once.

## Intuition

Different index choices can produce the same value subset. Sort `nums` so equal candidates are
adjacent, then choose only the first equal value among siblings at one recursion depth. Equal
values may still be chosen at later depths, which permits subsets such as `[2,2]` while removing
duplicate ways to form `[2]`.

Sorting mutates `nums`; `path` is also mutated during search but restored after each branch.

## Approach

1. Sort `nums`, then define `dfs(start)` over candidate indices at or after `start`.
2. Append `path[:]` at every node because every partial choice is a valid subset.
3. For each `i`, skip it when `i > start and nums[i] == nums[i - 1]`; this removes only equal
   sibling choices at the current depth.
4. Otherwise append `nums[i]`, recurse with `i + 1`, and pop it to restore `path`.
5. Return `res`. Copying `path` prevents all results from aliasing the same mutable list.

## Code

```python
class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res, path = [], []

        def dfs(start: int) -> None:
            res.append(path[:])
            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i - 1]:
                    continue
                path.append(nums[i])
                dfs(i + 1)
                path.pop()

        dfs(0)
        return res
```

## Why it works

At a recursion node, equal sibling values would produce identical path prefixes and identical
remaining value choices, so all but the first would duplicate that subtree. The skip removes
exactly those duplicate siblings. It does not skip the first equal candidate at a deeper node,
so any valid multiplicity can still be chosen. Inductively, each distinct continuation from
every path is explored once, making the emitted subsets complete and unique.

**Complexity**

- **Time:** `O(n * 2^n)` in the worst case, including copying up to `2^n` subsets; sorting costs
  `O(n log n)`.
- **Space:** `O(n)` auxiliary space for `path` and recursion, plus `O(n * 2^n)` output space.
