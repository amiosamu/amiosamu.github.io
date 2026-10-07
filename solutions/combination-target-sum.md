---
# Combination Sum · Medium · Backtracking
# https://leetcode.com/problems/combination-sum/
draft: false
pattern: "Reusable start index with sorted cutoff"
time: "O(n log n + (t/m) * n^(t/m))"
space: "O(n + t/m)"
---

## Description

Given distinct positive integers `candidates` and `target`, return every unique combination
whose sum is `target`. Each candidate may be selected any number of times.

**Example**

```
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
```

The combination `[2, 2, 3]` reuses `2`, while `[7]` reaches the target directly.

## Intuition

Generate combinations in nondecreasing order by allowing only indices at or after `start`.
This canonical order prevents permutations of the same values from becoming duplicate answers.
Recurse with the same index to permit reuse. Sorting also makes it safe to stop as soon as a
candidate exceeds the remaining target.

## Approach

1. Sort `candidates` in place, mutating its order so an oversized value ends the current loop.
2. In `dfs(start, remain)`, try each index `i >= start`. `path` holds the current nondecreasing
   combination and `remain` is the amount still needed.
3. Append `candidates[i]`, recurse with `i` to allow reuse, then pop to restore `path` for the
   next sibling. Break when the current value exceeds `remain`.
4. When `remain == 0`, append `path[:]` so the result keeps a snapshot rather than the mutable
   working list.

## Code

```python
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        res, path = [], []

        def dfs(start: int, remain: int) -> None:
            if remain == 0:
                res.append(path[:])
                return
            for i in range(start, len(candidates)):
                if candidates[i] > remain:
                    break
                path.append(candidates[i])
                dfs(i, remain - candidates[i])
                path.pop()

        dfs(0, target)
        return res
```

## Why it works

Every valid multiset has exactly one nondecreasing ordering. The `start` index permits precisely
those orderings, and recursing with `i` permits every multiplicity, so each valid answer has one
branch. Each branch records an answer only when its sum is exactly `target`; sorted pruning
removes only choices that already exceed the remainder. The traversal is therefore complete,
unique, and sound.

**Complexity**

- **Time:** `O(n log n + (t / m) * n^(t / m))` as a loose worst-case bound, where `t`
  is `target`, `m` is the smallest candidate, and `n = len(candidates)`; sorting and output
  copies are included.
- **Space:** `O(n + t / m)` auxiliary space for sorting, `path`, and recursion, plus the output.
