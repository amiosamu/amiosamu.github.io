---
# Word Search · Medium · Backtracking
# https://leetcode.com/problems/word-search/
draft: false
pattern: "Grid DFS with in-place visited mark"
time: "O(m * n * 4^L)"
space: "O(L)"
---

## Description

Given an `m x n` grid of characters `board` and a string `word`, determine whether `word` can be traced out by moving to horizontally or vertically adjacent cells, using each cell at most once.

**Example**

```
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true
```

Explanation: Starting at `board[0][0]` ('A'), the path A -> B -> C -> C -> E -> D moves through adjacent cells without reusing any cell, spelling out "ABCCED".

## Intuition

The path is a walk through the grid rather than a list of chosen items, but the shape is identical to every other backtracking problem: one decision per step (which of the four neighbours to move to), a base case that records success, and an undo on the way back up. The only wrinkle is "the same cell may not be used more than once" — which needs a visited marker that is local to the *current* path, not global. Overwriting `board[r][c]` with a sentinel and restoring it on the way out gives exactly that, with no extra visited set: a cell is off-limits only while it sits on the path being explored.

## Approach

1. Cache `rows, cols`. Write one recursive `dfs(r, c, k)` meaning "can `word[k:]` be spelled starting at cell `(r, c)`".
2. Order the base cases carefully: check `k == len(word)` **first** and return `True`. If the bounds/mismatch check came first, a full match ending at the grid edge would be rejected.
3. Then reject: out of bounds, or `board[r][c] != word[k]`, or the cell is the `'#'` sentinel (which can never equal a letter of `word`, so the same comparison covers it). Return `False`.
4. The path is implicit — it is the chain of cells currently marked `'#'` on the stack, and `k` is its length. Nothing needs copying because the answer is a boolean, not a list.
5. Choose: save `board[r][c]` (it equals `word[k]`), overwrite with `'#'`, then recurse into the four neighbours, OR-ing the results. Python's `or` short-circuits, so the first success stops the rest.
6. Undo: restore `board[r][c] = word[k]` before returning, whether the branch succeeded or failed. Skipping the restore corrupts the grid for every later starting cell — the bug that makes only the first `any(...)` candidate work.
7. Pruning rule: the character test at the top of `dfs` is the prune. A branch dies the instant a cell disagrees with `word[k]`, so the 4^L blowup is only realised on grids of nearly uniform letters.
8. Drive it from every cell: `any(dfs(r, c, 0) for r in range(rows) for c in range(cols))`.

## Code

```python
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])

        def dfs(r: int, c: int, k: int) -> bool:
            if k == len(word):
                return True
            if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[k]:
                return False
            board[r][c] = "#"
            found = (dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1)
                     or dfs(r, c + 1, k + 1) or dfs(r, c - 1, k + 1))
            board[r][c] = word[k]
            return found

        return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))
```

## Why it works

The invariant is that on entry to `dfs(r, c, k)` the cells currently holding `'#'` are exactly the `k` cells already matched on this path, so no cell can be reused, and the restore on exit re-establishes it for every sibling and every later start cell. Any valid placement of `word` starts at some cell and proceeds through adjacent cells, and the search tries all four neighbours at each step from all `m * n` starts, so nothing is missed. Each path is at most `L = len(word)` long with 4 branches per step (really 3 after the first, since you never step back onto a `'#'`), giving the O(m * n * 4^L) bound and O(L) stack space with no auxiliary visited structure.
