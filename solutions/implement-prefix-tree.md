---
# Implement Trie Prefix Tree · Medium · Tries
# https://leetcode.com/problems/implement-trie-prefix-tree/
draft: false
pattern: "Trie of per-node child maps"
time: "O(L) per operation"
space: "O(n)"
---

## Description

Implement a `Trie` that inserts words, tests exact-word membership, and tests whether any
inserted word begins with a given prefix.

**Example**

```
Input: ["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
Output: [null, null, true, false, true, null, true]
```

Explanation: `"app"` is initially only a prefix of `"apple"`; after it is inserted, it is
also an exact stored word.

## Intuition

A trie stores each word as a path of characters from the root. Words with common prefixes
share path nodes, so checking a prefix requires following only that prefix's characters.

Path existence alone is insufficient for exact search: after inserting `"apple"`, the path
for `"app"` exists. Each node therefore has an `is_word` flag indicating that a word ends
there.

## Approach

1. Store a `children` dictionary and an `is_word` flag in every `Trie` node; the main
   object also serves as the root.
2. For `insert`, follow each character, creating a child when needed, then mark the final
   node as a complete word.
3. `_walk` follows a string and returns its final node, or `None` when an edge is missing.
4. `search` requires both a completed walk and `is_word`; `startsWith` requires only a
   completed walk.
5. Walking an empty string returns the root. It is always a valid prefix and becomes a
   searchable word only if the empty string is inserted.

## Code

```python
class Trie:

    def __init__(self):
        self.children = {}
        self.is_word = False

    def insert(self, word: str) -> None:
        node = self
        for ch in word:
            if ch not in node.children:
                node.children[ch] = Trie()
            node = node.children[ch]
        node.is_word = True

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.is_word

    def startsWith(self, prefix: str) -> bool:
        return self._walk(prefix) is not None

    def _walk(self, s: str):
        node = self
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node
```

## Why it works

After inserting a word, induction over its characters shows that its path exists from the
root, and its terminal node is marked. `_walk` succeeds exactly when every required edge on
such a path exists. Therefore `startsWith` is true exactly for stored prefixes, while the
terminal flag makes `search` true exactly for complete inserted words. Shared nodes do not
change either property because each outgoing edge is labeled by its character.

**Complexity**

- **Time:** `O(L)` per operation for an input string of length `L`.
- **Space:** `O(N)` total, where `N` is the number of inserted characters; shared prefixes
  can reduce the actual node count.
