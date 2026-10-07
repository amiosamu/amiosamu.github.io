---
# Word Search II · Hard · Tries
# https://leetcode.com/problems/word-search-ii/
draft: false
pattern: "Trie-pruned grid backtracking"
time: "O(m * n * 4^L)"
space: "O(k)"
---

## Description

Given an `m x n` character grid `board` and a list `words`, return every listed word that can be
formed from orthogonally adjacent cells. A cell may be used at most once within one word.

**Example**

```
Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]
```

Explanation: `"oath"` and `"eat"` have valid paths; `"pea"` and `"rain"` do not.

## Intuition

A trie shares work among words with common prefixes. During grid DFS, the current trie node
represents the letters already matched. If the next board character is absent from that node,
no remaining word can extend the path, so the branch stops immediately.

Terminal nodes store complete words to avoid rebuilding strings. Removing a terminal marker
prevents duplicate output, and pruning an empty trie branch avoids searching prefixes whose
words have all been found.

## Approach

1. Build a trie of `words`; store each complete word under the terminal key `"$"`.
2. Start DFS from every board cell, carrying the parent trie node. Stop if the cell's character
   has no corresponding child.
3. Pop and record `nxt["$"]` when present, ensuring a word is returned only once.
4. Replace the cell with `"#"`, search its four valid neighbors, and restore the character so
   other paths see the original board.
5. Remove `ch` from its parent when `nxt` becomes empty; no unfound word uses that prefix.

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

On entry to `dfs`, `node` represents the letters before `(r, c)`, and the `"#"` cells are
exactly the current path. Descending through `ch` preserves this invariant, while a missing
trie edge proves that no word extends the path. Trying every start and every legal continuation
therefore reaches every formable word. A terminal marker is removed after its first visit, so
each word is emitted once. Restoring the board makes mutation local to one path, and pruning is
safe because an empty trie node contains no unfound terminal.

**Complexity**

- **Time:** `O(m * n * 4^L)` in the stated upper bound, where `L` is the longest word; trie
  pruning usually cuts many branches.
- **Space:** `O(k)` for the trie and recursion, where `k` is the total number of characters in
  `words`; the output is additional.
