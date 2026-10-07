---
# Permutations II · Medium · Backtracking
# https://leetcode.com/problems/permutations-ii/
draft: false
pattern: "Sort plus used-flag sibling skip"
time: "O(n * n!)"
space: "O(n)"
---

## Description

Given an integer array `nums` that may contain duplicates, return every distinct permutation in
any order.

**Example**

```
Input: nums = [1,1,2]
Output: [[1,1,2],[1,2,1],[2,1,1]]
```

Explanation: Exchanging the two equal `1`s does not create a new value sequence, so only three
distinct permutations exist.

## Intuition

Tracking used indices prevents index reuse, but equal values at different indices can still create
the same permutation. Sorting places duplicates together. At any recursion depth, allowing the
leftmost unused copy and skipping later unused copies chooses one canonical index order for each
value sequence.

## Approach

1. Sort `nums` in place so equal values are adjacent. This mutates the input array but does not
   affect which permutations are returned.
2. Maintain `path`, the current value sequence, and `used[i]`, which records whether sorted
   index `i` is already in `path`.
3. At each depth, skip used indices. Also skip index `i` when it equals its left neighbor and
   that neighbor is unused; the left copy must be selected first among sibling choices.
4. Choose an index, recurse, and undo both `path` and `used`. When `path` has length `n`, append
   a copy because the working list continues to mutate.
5. Return all completed paths in `res`.

## Code

```python
class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res, path = [], []
        used = [False] * len(nums)

        def dfs() -> None:
            if len(path) == len(nums):
                res.append(path[:])
                return
            for i in range(len(nums)):
                if used[i]:
                    continue
                if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
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

Every emitted path uses each index once because `used` blocks reuse. For any target permutation,
assign equal values to their sorted indices from left to right. That canonical assignment is never
skipped, so every distinct permutation is produced. Any noncanonical assignment must select a
duplicate while its equal left neighbor is still unused; the skip rule rejects it at the first
such choice. Therefore no value sequence is emitted twice.

**Complexity**

- **Time:** `O(n * n!)` in the worst case, including copying each completed permutation.
- **Space:** `O(n)` auxiliary space for `path`, `used`, and recursion; output uses
  `O(n * P)` for `P` distinct permutations.
