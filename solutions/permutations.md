---
# Permutations · Medium · Backtracking
# https://leetcode.com/problems/permutations/
draft: false
pattern: "Used-flag permutation backtracking"
time: "O(n * n!)"
space: "O(n)"
---

## Description

Given an array `nums` of distinct integers, return all permutations in any order.

**Example**

```
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

Explanation: Three distinct elements have `3! = 6` possible orderings.

## Intuition

Each position in a permutation may choose any element not used earlier in that path. A start index,
as used for combinations, would incorrectly forbid orderings such as `[2, 1]`. A Boolean array
instead tracks exactly which input indices are already present in the current path.

## Approach

1. Create an empty `path`, a `used` array for input indices, and result list `res`.
2. At each recursion depth, scan every index. Skip indices already marked in `used`.
3. Mark an available index, append its value to `path`, recurse, and then undo both mutations
   so sibling branches start from the same state.
4. When `path` contains all `n` values, append `path[:]`; storing a copy prevents later
   backtracking from changing an existing answer.
5. Start the search and return `res`. The input array itself is never modified.

## Code

```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        res, path = [], []
        used = [False] * len(nums)

        def dfs() -> None:
            if len(path) == len(nums):
                res.append(path[:])
                return
            for i in range(len(nums)):
                if used[i]:
                    continue
                used[i] = True
                path.append(nums[i])
                dfs()
                path.pop()
                used[i] = False

        dfs()
        return res
```

## Why it works

On entry to each call, `path` contains exactly the values whose indices are marked in `used`, in
their chosen order. Choosing any unmarked index preserves this invariant, and backtracking restores
it for the next branch. At depth `n`, every index appears exactly once, so each leaf is a valid
permutation. Conversely, every permutation determines one sequence of index choices, which the
search visits. Distinct inputs make those leaves distinct, proving exact enumeration.

**Complexity**

- **Time:** `O(n * n!)`, because there are `n!` outputs and each takes `O(n)` to copy.
- **Space:** `O(n)` auxiliary space; the returned permutations occupy `O(n * n!)` space.
