---
# Combination Sum II · Medium · Backtracking
# https://leetcode.com/problems/combination-sum-ii/
draft: false
pattern: "Sort, skip equal siblings, advance index"
time: "O(n * 2^n)"
space: "O(n)"
---

## Intuition

Two changes from Combination Sum, and they pull in opposite directions. Each candidate may be used at most once, so the recursion advances to `i + 1`. But `candidates` may now contain repeats, so the start index alone no longer prevents duplicate *answers*: with `[1,1,2]` and target 3, index 0 and index 1 both produce `[1,2]`. The fix is the Subsets II rule — sort, then at any one node skip a candidate whose value equals the previous sibling's. Sorting also keeps the `break` prune from Combination Sum, which is what stops this from degenerating into a full 2^n walk on large inputs.

## Approach

1. Sort `candidates` ascending. It powers both the equal-sibling skip and the `break`.
2. The decision at each node is which index `i >= start` to append next; each index is consumable once, so the recursion passes `i + 1`.
3. `path` holds the chosen values in non-decreasing order; `remain` is the target minus their sum; `res` collects finished combinations.
4. Base case: `remain == 0` — append `path[:]` and return.
5. Pruning rule: `if candidates[i] > remain: break`. Sorted order means every later sibling overshoots too. (Candidates are positive, so `remain` never needs a negative check.)
6. Duplicate rule: `if i > start and candidates[i] == candidates[i - 1]: continue`. The `i > start` guard restricts the skip to *siblings at this node* — an equal value at the next depth is still allowed, which is how `[1,1,6]` survives when the input has two 1s.
7. Body: `path.append(candidates[i])`, `dfs(i + 1, remain - candidates[i])`, `path.pop()` — undo before moving to the next sibling so `path` always describes the current node.
8. Append `path[:]`, a copy — `path` is mutated in place for the whole traversal, so a stored reference would alias and end up empty.

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

After sorting, each distinct answer multiset has one canonical index set — the earliest indices spelling it — and the equal-sibling skip deletes exactly the non-canonical branches, since a sibling with the same value roots an identical subtree. Nothing valid is lost, because the first occurrence in each run of equal values is never skipped, and nothing valid is cut by the `break`, because sorted order makes the overshoot monotone. The tree has at most 2^n nodes and each records a copy of length up to n, so O(n * 2^n) time and O(n) auxiliary space beyond the output.
