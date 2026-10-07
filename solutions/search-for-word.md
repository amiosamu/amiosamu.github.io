---
# Word Search · Medium · Backtracking
# https://leetcode.com/problems/word-search/
draft: false
pattern: "Grid DFS with in-place visited mark"
time: "O(m * n * 4^L)"
space: "O(L)"
---

## Description

Given an `m x n` character grid `board` and a string `word`, determine whether the word can be
formed from orthogonally adjacent cells without using a cell more than once.

**Example**

```
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true
```

Explanation: The path `A -> B -> C -> C -> E -> D` uses adjacent, distinct cells.

## Intuition

Backtracking tries each possible next cell and undoes the choice afterward. The visited state
must apply only to the current path: a cell used by one failed path must remain available to a
later path. Temporarily replacing its character with `"#"` provides this state without a
separate set, provided the character is restored before returning.

## Approach

1. Define `dfs(r, c, k)` to test whether `word[k:]` can start at `(r, c)`.
2. Return `True` when `k == len(word)`. Otherwise reject an out-of-bounds cell or a character
   that does not equal `word[k]`.
3. Save the matching character, write `"#"`, and recursively try all four neighbors for
   `k + 1`. The sentinel prevents reuse on this path.
4. Restore the saved character before returning, whether the search succeeds or fails.
5. Call `dfs` with `k = 0` from every cell. `any` stops after the first complete match.

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
            ch = board[r][c]
            board[r][c] = "#"
            found = (dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1)
                     or dfs(r, c + 1, k + 1) or dfs(r, c - 1, k + 1))
            board[r][c] = ch
            return found

        return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))
```

## Why it works

At depth `k`, the `"#"` cells are exactly the `k` distinct cells that matched `word[:k]`.
A matching next cell is marked before recursion, so no path can reuse it; restoration preserves
the invariant for sibling branches. Every valid word placement has some starting cell and a
sequence of orthogonal moves, all of which the outer loop and recursion enumerate. Reaching
`k == len(word)` therefore occurs exactly when a valid placement has been matched.

**Complexity**

- **Time:** `O(m * n * 4^L)` in the stated upper bound for word length `L`.
- **Space:** `O(L)` for the recursion stack; `board` is temporarily modified in place.
