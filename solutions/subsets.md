---
# Subsets · Medium · Backtracking
# https://leetcode.com/problems/subsets/
draft: false
pattern: "Start-index subset backtracking"
time: "O(n * 2^n)"
space: "O(n)"
---

## Description

Given an integer array `nums` of unique elements, return its power set in any order.

**Example**

```
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

Explanation: All `2^3 = 8` choices of included elements appear exactly once.

## Intuition

At each recursion node, choose which later element to append next. Restricting choices to indices
at or after `start` builds elements in increasing index order, so the same subset cannot appear
in a different order. Every partial path is already a valid subset and should be recorded, not
only leaf paths.

## Approach

1. Keep `path` as the current subset and define `dfs(start)` to choose only indices at or after
   `start`.
2. Append `path[:]` on entry; a copy is required because later branches mutate `path`.
3. For each candidate index `i`, append `nums[i]`, recurse with `i + 1`, then pop to restore the
   current path before the next sibling.
4. Start with `dfs(0)` and return all recorded subsets. When no candidates remain, the loop ends
   naturally.

## Code

```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res, path = [], []

        def dfs(start: int) -> None:
            res.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                dfs(i + 1)
                path.pop()

        dfs(0)
        return res
```

## Why it works

Every subset of unique input elements corresponds to exactly one increasing sequence of their
indices. By induction on that sequence, the recursion can follow it because each call permits
every later index, so every subset is reached. Conversely, all generated paths have strictly
increasing indices, so two different paths cannot represent the same subset. Recording every
path therefore produces the complete power set exactly once.

**Complexity**

- **Time:** `O(n * 2^n)` to generate and copy all subsets.
- **Space:** `O(n)` auxiliary space for `path` and recursion, plus `O(n * 2^n)` output space.
