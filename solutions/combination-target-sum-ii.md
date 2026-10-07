---
# Combination Sum II · Medium · Backtracking
# https://leetcode.com/problems/combination-sum-ii/
draft: false
pattern: "Sort, skip equal siblings, advance index"
time: "O(n * 2^n)"
space: "O(n)"
---

## Description

Given candidate numbers and a `target`, return every unique combination that sums to `target`.
Each input element may be used at most once, and duplicate values may occur in the input.

**Example**

```
Input: candidates = [10,1,2,7,6,1,5], target = 8
Output: [[1,1,6],[1,2,5],[1,7],[2,6]]
```

Every listed combination sums to 8. Although the input contains two `1`s, equal combinations
are returned only once.

## Intuition

Sorting places equal values together. At one recursion depth, choosing either of two equal
siblings would create the same remaining search, so all but the first are skipped. Equal values
at different depths remain available, which allows combinations such as `[1, 1, 6]`.

## Approach

1. Sort `candidates` in place. This mutates its order and enables duplicate skipping and early
   termination when a value exceeds `remain`.
2. Let `dfs(start, remain)` choose the next index at or after `start`; recurse with `i + 1` so
   an input element cannot be reused.
3. At each depth, skip `candidates[i]` when it equals the previous sibling. Break when it is
   greater than `remain`, because every later value is at least as large.
4. Append each choice to `path`, recurse, and pop it afterward. When `remain == 0`, append a
   copy of `path` to `res` so later mutations cannot change the stored answer.

## Code

```python
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        res, path = [], []

        def dfs(start: int, remain: int) -> None:
            if remain == 0:
                res.append(path[:])
                return
            for i in range(start, len(candidates)):
                if candidates[i] > remain:
                    break
                if i > start and candidates[i] == candidates[i - 1]:
                    continue
                path.append(candidates[i])
                dfs(i + 1, remain - candidates[i])
                path.pop()

        dfs(0, target)
        return res
```

## Why it works

At every call, `path` is nondecreasing and contains distinct input indices before `start`.
Advancing to `i + 1` preserves single use. For each answer, choosing the first available equal
sibling gives one canonical branch; skipped equal siblings would generate identical suffixes.
The sorted cutoff removes only values that cannot fit. Thus every valid combination appears
once and no invalid combination is recorded.

**Complexity**

- **Time:** `O(n * 2^n)` in the worst case, including copying answers of length up to `n`.
- **Space:** `O(n)` auxiliary recursion and path space, plus the output.
