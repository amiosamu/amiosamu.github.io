---
# Combination Sum · Medium · Backtracking
# https://leetcode.com/problems/combination-sum/
draft: false
pattern: "Reusable start index with sorted cutoff"
time: "O(n^(t/m))"
space: "O(t/m)"
---

## Description

Given an array of distinct positive integers `candidates` and a target integer `target`, return all unique combinations of `candidates` where the chosen numbers sum to `target`. The same number may be chosen from `candidates` an unlimited number of times.

**Example**

```
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
```

Explanation: `2 + 2 + 3 == 7` reuses `2` twice, and `7` alone also sums to `7`; both are valid, and no other combination of the candidates reaches 7.

## Intuition

Candidates may be reused without limit, so the loop recurses on `i` rather than `i + 1` — that is the only structural difference from Subsets. The start index still does the deduplication work: it forbids ever going *back* to a smaller index, so a combination is only ever assembled in non-decreasing order and `[2,3]` and `[3,2]` cannot both appear. Sorting the candidates buys a real prune on top of that: once `candidates[i] > remain` the rest of the row is even bigger, so I can `break` out of the loop instead of testing each remaining sibling.

## Approach

1. Sort `candidates` ascending — required for the `break` prune to be valid.
2. The decision at each node is which candidate index `i >= start` to append next; unlimited reuse means the same `i` may be chosen again at the next depth.
3. `path` holds the numbers chosen so far in non-decreasing order; `remain` is the target minus their sum, carried down so no re-summing is needed; `res` collects finished combinations.
4. Base case: `remain == 0` — append `path[:]` and return. There is no separate "overshot" case, because the prune below never lets `remain` go negative.
5. Pruning rule: inside the loop, `if candidates[i] > remain: break`. Sorted order means every later sibling is at least as large, so all of them overshoot too — `break`, not `continue`.
6. Body: `path.append(candidates[i])`, then `dfs(i, remain - candidates[i])` — pass `i`, not `i + 1`, so the same candidate can repeat — then `path.pop()` to undo before the next sibling.
7. Append `path[:]`, a copy: `path` is one list mutated throughout the traversal, so a stored reference would be aliased and eventually empty.
8. No sort-then-skip-equal-siblings step here: the problem states the candidates are distinct, and repeats within one combination are wanted, not filtered.

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

Every multiset of candidates summing to `target` has exactly one non-decreasing arrangement, and the traversal generates precisely the non-decreasing sequences — the non-decreasing start index gives uniqueness, and allowing `i` again gives completeness for repeats. The `break` is safe because sorted order makes `candidates[i] > remain` imply the same for all `j > i`, so nothing reachable is cut. Depth is bounded by `t/m` where `t` is the target and `m` the smallest candidate (every level subtracts at least `m`), and each node branches at most `n` ways, giving the O(n^(t/m)) bound; the auxiliary space is `path` plus a stack of that same depth.
