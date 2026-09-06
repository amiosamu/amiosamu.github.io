---
# Implement Trie Prefix Tree · Medium · Tries
# https://leetcode.com/problems/implement-trie-prefix-tree/
draft: false
pattern: "Trie of per-node child maps"
time: "O(L) per operation"
space: "O(n)"
---

## Description

Implement a `Trie` (prefix tree) that supports `insert(word)` to add a string, `search(word)` to check whether an exact word was inserted, and `startsWith(prefix)` to check whether any inserted word begins with the given prefix.

**Example**

```
Input: ["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
Output: [null, null, true, false, true, null, true]
```

Explanation: After `insert("apple")`, `search("apple")` is true but `search("app")` is false because "app" was never inserted whole; `startsWith("app")` is true since "apple" begins with "app", and once "app" itself is inserted, `search("app")` also becomes true.

## Intuition

A hash set of words answers `search` in O(1) but tells you nothing about `startsWith` short of scanning every word. The fix is to stop storing words as units and store them as paths: one node per character, shared prefixes sharing nodes. Then a prefix query is just "does this path exist" and a full-word query is "does this path exist **and** is its last node marked as the end of a word". The `is_word` flag is the only thing separating the two, and it is why `insert("apple")` does not make `search("app")` true.

## Approach

1. A node is `children` (a dict from character to child node) plus a boolean `is_word`. The `Trie` object itself is the root node — no separate node class needed.
2. `insert(word)`: start `node = self`. For each `ch` in `word`, create `node.children[ch] = Trie()` if absent, then descend into it. After the loop set `node.is_word = True`.
3. Write one private helper `_walk(s)` that descends character by character from the root and returns the node reached, or `None` the moment a character is missing from `node.children`.
4. `search(word)`: `node = self._walk(word)`; return `node is not None and node.is_word`.
5. `startsWith(prefix)`: return `self._walk(prefix) is not None` — reaching the node is the whole answer, the flag is irrelevant here.
6. Edge case: the empty string walks zero characters and returns the root, so `startsWith("")` is `True` and `search("")` is `False` unless `""` was inserted. Both are correct.

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

The invariant is that a node at depth `d` is reachable by exactly one path from the root, and that path spells the unique prefix the node represents — so "the prefix exists in the trie" and "`_walk` returns non-`None`" are the same statement. Marking `is_word` on the terminal node of each inserted word keeps membership separate from prefix-hood, which is the only ambiguity a shared-path structure introduces. Every operation touches one node per input character and does O(1) dict work at each, so all three are O(L); the trie holds at most one node per character ever inserted, hence O(n) space over all inserted words.
