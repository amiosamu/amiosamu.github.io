---
# Permutations · Medium · Backtracking
# https://leetcode.com/problems/permutations/
draft: false
pattern: "Used-flag permutation backtracking"
time: "O(n * n!)"
space: "O(n)"
---

## Intuition

Order matters here, which is exactly why the start index used by every subset problem is wrong: `[1,2]` and `[2,1]` are *different* answers, so I must never forbid going back to an earlier index. What I do have to forbid is reusing the same position twice, and that needs a `used` array — a boolean per index of `nums`, not a set of values, since equal values would collide. Each node then loops over all n indices and descends into whichever are still free, giving a tree with n choices at the root, n-1 below it, and so on: n! leaves, one per permutation.

## Approach

1. The decision at each node is which *index* of `nums` to place next; the loop scans all of `0..n-1` and skips the ones already consumed.
2. `path` holds the values placed so far, in output order; `used[i]` is `True` when index `i` is already in `path`; `res` collects finished permutations.
3. Base case: `len(path) == len(nums)` — every index is consumed, so append `path[:]` and return.
4. Duplicate rule: a used-set, not a start index. `if used[i]: continue` is the only filter, and it prevents reusing a position rather than reordering — which is what makes this different from Subsets. `nums` is guaranteed distinct, so no equal-sibling skip is needed (that's Permutations II).
5. Choose: set `used[i] = True` and `path.append(nums[i])`. Recurse with `dfs()` — no argument is needed, since `len(path)` already encodes the depth.
6. Undo both, in reverse: `path.pop()` then `used[i] = False`. Forgetting the `used[i] = False` is the classic bug — the first leaf would be found and every later branch would starve.
7. Append `path[:]`, a copy: `path` is one list mutated for the whole traversal, so a stored reference would alias all n! entries onto the same eventually-empty list.
8. No pruning: every node with a free index leads to at least one complete permutation, so there is no dead branch to cut.

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

The invariant is that on entry to `dfs`, `path` is the sequence of chosen values and `used` marks exactly their indices — the pair is always consistent because every mutation is undone on the way back up. Under that invariant a leaf is an arrangement of all n indices, and distinct root-to-leaf choice sequences give distinct arrangements, so the traversal enumerates each of the n! permutations exactly once. Every leaf costs O(n) to copy and the internal nodes are outnumbered by the leaves, hence O(n * n!) time with only `path`, `used`, and a depth-n stack as auxiliary space.
