---
# Combinations · Medium · Backtracking
# https://leetcode.com/problems/combinations/
draft: false
pattern: "Start-index combinations with tail pruning"
time: "O(k * C(n, k))"
space: "O(k)"
---

## Description

Given `n` and `k`, return every combination of `k` distinct values chosen from `[1, n]`.
Order within a combination does not matter.

**Example**

```
Input: n = 4, k = 2
Output: [[2,4],[3,4],[2,3],[1,2],[1,3],[1,4]]
```

All six pairs from `[1, 4]` appear once; reversed duplicates are omitted.

## Intuition

Choose values in increasing order so every set has one representation. If `need` values remain,
the next choice cannot be greater than `n - need + 1`; beyond that point too few values remain
to fill the combination. This bound avoids branches that cannot reach length `k`.

## Approach

1. Let `dfs(start)` choose the next value at or after `start`; `path` is always increasing.
2. When `len(path) == k`, append `path[:]` so later backtracking cannot mutate the result.
3. If `need = k - len(path)`, try `i` only through `n - need + 1`, the last value that leaves
   enough larger numbers to finish.
4. Append `i`, recurse with `i + 1`, and pop it afterward. Start the search at `1`.

## Code

```python
class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        res, path = [], []

        def dfs(start: int) -> None:
            if len(path) == k:
                res.append(path[:])
                return
            for i in range(start, n - (k - len(path)) + 2):
                path.append(i)
                dfs(i + 1)
                path.pop()

        dfs(1)
        return res
```

## Why it works

On entry to `dfs(start)`, `path` is increasing and every future value must be at least `start`.
Choosing `i` and recursing with `i + 1` preserves this invariant. Every `k`-element set has one
increasing ordering and therefore one search path. The upper bound removes only choices with
fewer than `need` available values, so it cannot remove a complete combination.

**Complexity**

- **Time:** `O(k * C(n, k))`, including copying each returned combination.
- **Space:** `O(k)` auxiliary path and recursion space, plus `O(k * C(n, k))` output space.
