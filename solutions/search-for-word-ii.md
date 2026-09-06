---
# Word Search II · Hard · Tries
# https://leetcode.com/problems/word-search-ii/
draft: false
pattern: "Trie-pruned grid backtracking"
time: "O(m * n * 4^L)"
space: "O(k)"
---

## Description

Given an `m x n` grid of characters `board` and a list of strings `words`, return all words from the list that can be traced out by moving to horizontally or vertically adjacent cells, using each cell at most once per word.

**Example**

```
Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]
```

Explanation: "oath" and "eat" can each be traced through a path of adjacent cells on the board, while "pea" and "rain" cannot be formed from any adjacent-cell path.

## Intuition

Running Word Search I once per word re-walks the same grid paths over and over — every word beginning with `"oa"` pays for that prefix separately. Flip it around: put all the words in a trie and do **one** DFS per starting cell, carrying a trie node alongside the grid position. The path spelled so far is then checked against every word at once, and the search dies the instant the current path is not a prefix of anything in the dictionary, which is what makes the exponential branching harmless in practice. Two extra tricks matter: store the whole word on its terminal node so a hit needs no string rebuilding, and delete exhausted branches from the trie so the same ground is never re-searched.

## Approach

1. Build the trie as nested dicts. For each `w` in `words`, descend with `node = node.setdefault(ch, {})` and then set `node['$'] = w` — the marker holds the word itself, not just a flag.
2. `res = []`, `rows, cols = len(board), len(board[0])`.
3. `dfs(r, c, node)` takes the *parent* trie node and the cell about to be consumed. Read `ch = board[r][c]` and `nxt = node.get(ch)`; if `nxt` is `None` the path is not a prefix of any remaining word, so return immediately.
4. Collect with `word = nxt.pop('$', None)`; if it is not `None`, append it to `res`. Popping — rather than reading — is the de-duplication: the same word can be spelled by several paths, and removing the marker means it is reported exactly once.
5. Mark the cell visited by overwriting `board[r][c] = '#'`, recurse into the four neighbours that are in bounds and not `'#'`, then restore `board[r][c] = ch`. Mutating the board is the visited set; no separate structure is needed as long as the restore always happens.
6. After the restore, prune: `if not nxt: node.pop(ch)`. An empty dict means that subtree had its last word collected and nothing branches off it, so it can never match again.
7. Run `dfs(r, c, root)` from every cell and return `res`.

## Code

```python
class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        root = {}
        for w in words:
            node = root
            for ch in w:
                node = node.setdefault(ch, {})
            node['$'] = w

        rows, cols = len(board), len(board[0])
        res = []

        def dfs(r, c, node):
            ch = board[r][c]
            nxt = node.get(ch)
            if nxt is None:
                return
            word = nxt.pop('$', None)
            if word is not None:
                res.append(word)
            board[r][c] = '#'
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                    dfs(nr, nc, nxt)
            board[r][c] = ch
            if not nxt:
                node.pop(ch)

        for r in range(rows):
            for c in range(cols):
                dfs(r, c, root)
        return res
```

## Why it works

The invariant is that on entry to `dfs(r, c, node)` the cells on the current path are exactly the `'#'` cells and `node` is the trie node for the letters spelled by that path so far — so descending to `nxt` keeps the two in step, and the `nxt is None` check prunes precisely the paths that no word extends. Every word reachable by some legal path is found because the outer loop tries all starts and the DFS tries all four continuations, and none is double-counted because its `'$'` marker is popped on first discovery. The `'#'` write plus the unconditional restore after the loop guarantees each cell is used at most once per path and is free again for sibling branches; the leaf-pruning `node.pop(ch)` only ever removes subtrees with no words left, so it cannot discard a hit. The bound is O(m * n) starts times at most `4 * 3^(L-1)` self-avoiding paths of the longest word length `L`, with O(k) space for the trie over the `k` characters in `words`.
