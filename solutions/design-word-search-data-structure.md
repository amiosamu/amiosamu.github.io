---
# Design Add And Search Words Data Structure · Medium · Tries
# https://leetcode.com/problems/design-add-and-search-words-data-structure/
draft: false
pattern: "Trie with DFS over wildcards"
time: "O(L) add, O(26^L) search"
space: "O(n)"
---

## Intuition

Without the `.` this is a plain trie. The `.` is what breaks the single-path walk: at that position the search is no longer at one node but at *any* child of the current node, so matching stops being a loop and becomes a branching search. The insight is that the branching is bounded — a `.` forks into at most 26 subtrees, and every fork still consumes one character of the pattern, so the recursion depth is the pattern length. So: walk deterministically while the character is a letter, and recurse over `node.children.values()` only when you hit a dot.

## Approach

1. Reuse the trie node shape: `children` dict plus `is_word`. The `WordDictionary` instance is the root.
2. `addWord(word)`: descend from `self`, creating `WordDictionary()` children for missing characters, then set `is_word = True` on the final node.
3. `search(word)`: define an inner `dfs(i, node)` meaning "can `word[i:]` be matched starting from `node`".
4. Inside `dfs`, loop `j` from `i` to `len(word) - 1` and handle the deterministic case in place: if `word[j]` is a real letter, fail with `False` when it is absent from `node.children`, otherwise reassign `node = node.children[word[j]]` and keep looping. This keeps dot-free searches iterative with no recursion at all.
5. When `word[j] == '.'`, return `any(dfs(j + 1, child) for child in node.children.values())` — hand each subtree the rest of the pattern and let short-circuiting stop at the first match. Returning here is essential; the loop must not continue past the fork.
6. If the loop finishes without returning, the whole pattern was consumed, so return `node.is_word` — not `True`. A pattern can land on a real trie node that is only a prefix, e.g. `search("ba")` after `addWord("bad")`.
7. `search` returns `dfs(0, self)`.

## Code

```python
class WordDictionary:

    def __init__(self):
        self.children = {}
        self.is_word = False

    def addWord(self, word: str) -> None:
        node = self
        for ch in word:
            if ch not in node.children:
                node.children[ch] = WordDictionary()
            node = node.children[ch]
        node.is_word = True

    def search(self, word: str) -> bool:
        def dfs(i, node):
            for j in range(i, len(word)):
                ch = word[j]
                if ch == '.':
                    return any(dfs(j + 1, child) for child in node.children.values())
                if ch not in node.children:
                    return False
                node = node.children[ch]
            return node.is_word

        return dfs(0, self)
```

## Why it works

`dfs(i, node)` is true exactly when some stored word has `node`'s prefix followed by a match of `word[i:]`, and the two cases are exhaustive: a letter admits one continuation, a dot admits all of them, and `any` covers the union. Because the recursion advances `j` by one on every fork, no branch can revisit a (position, node) pair, so the search terminates in depth at most `L`. A dot-free search touches one node per character, O(L); an all-dots pattern is the worst case, forking 26 ways per level for the O(26^L) bound, and the trie stores one node per character ever added, O(n).
