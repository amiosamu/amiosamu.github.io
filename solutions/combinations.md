---
# Combinations · Medium · Backtracking
# https://leetcode.com/problems/combinations/
draft: false
pattern: "Start-index combinations with tail pruning"
time: "O(k * C(n, k))"
space: "O(k)"
---

## Intuition

This is Subsets with a size filter, so the skeleton is identical: pick the next number only from values at or after `start`, which forces every combination into increasing order and therefore generates it once. The one addition worth making is the pruning bound. If `path` already has `len(path)` numbers, I still need `k - len(path)` more, and they must all come from `i..n` — so any `i` with fewer than that many numbers left behind it is a dead branch. Cutting the loop there rather than recursing and failing at the base case is the difference between exploring C(n, k) nodes and exploring 2^n of them.

## Approach

1. The decision at each node is which number `i >= start` to append next, from the range `1..n`.
2. `path` holds the numbers chosen so far in increasing order; `res` collects finished combinations.
3. Base case: `len(path) == k` — append `path[:]` to `res` and return immediately. Returning matters, since going deeper could only overshoot `k`.
4. Pruning rule: I need `need = k - len(path)` more numbers, and the numbers `i..n` number `n - i + 1`, so a viable `i` satisfies `i <= n - need + 1`. That makes the loop `for i in range(start, n - (k - len(path)) + 2)` (the `+2` is `+1` for the bound and `+1` because `range` is exclusive).
5. Inside the loop: `path.append(i)`, recurse with `dfs(i + 1)`, then `path.pop()` to undo the choice so the next sibling starts from the same state.
6. Append `path[:]`, a copy — `path` is one mutable list shared by the whole traversal, so storing it directly would put n aliases of the same (eventually empty) list into `res`.
7. Duplicates are avoided by the start index, not a used-set: `dfs(i + 1)` makes it impossible to revisit `i` or anything below it, so each k-subset is emitted only in its sorted order.
8. Start with `dfs(1)` since the range is 1-indexed.

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

Each combination corresponds to exactly one increasing sequence of choices, so the traversal enumerates each of the C(n, k) sets once — the start index gives no-duplicates, and the loop covering every legal `i` gives completeness. The prune is safe rather than merely fast: it only removes `i` values for which the remaining `n - i + 1` numbers cannot fill the remaining `k - len(path)` slots, so no reachable answer is cut. With the prune, every root-to-leaf path ends in a recorded combination, so the work is O(k) per leaf across C(n, k) leaves, and the only auxiliary memory is `path` and a stack of depth k.
