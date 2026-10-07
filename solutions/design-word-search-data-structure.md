---
# Design Add And Search Words Data Structure · Medium · Tries
# https://leetcode.com/problems/design-add-and-search-words-data-structure/
draft: false
pattern: "Trie with DFS over wildcards"
time: "O(L) add, O(26^L) search"
space: "O(n)"
---

## Description

Design a `WordDictionary` with `addWord` and `search`. A search pattern may contain `.`,
which matches any single letter.

**Example**

```
Input:
operations = ["WordDictionary", "addWord", "addWord", "addWord", "search",
              "search", "search", "search"]
arguments = [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]
Output: [null, null, null, null, false, true, true, true]
```

`"pad"` is absent, while `".ad"` can match any of the three stored words and `"b.."`
matches `"bad"`.

## Intuition

A trie follows one child for an ordinary letter. A wildcard is different because every
child may match, so search must branch at that position. Each branch still consumes one
pattern character, which bounds recursion depth by the pattern length.

Continue ordinary-letter runs in a loop and recurse only at wildcards. A terminal marker
is required because reaching a trie node proves only that a prefix exists, not a full word.

## Approach

1. Represent each trie node with `children` and `is_word`; the dictionary object itself is
   the root.
2. `addWord` follows or creates one child per letter, then marks the final node.
3. Define `dfs(i, node)` to match `word[i:]`. Follow ordinary letters directly, returning
   `False` when the required child is absent.
4. At `.`, recurse from the next pattern index into every child and return whether any
   branch matches.
5. After consuming the pattern, return `node.is_word` so a proper prefix is not accepted.
   Searching an empty pattern therefore succeeds only if an empty word was added.

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

For `dfs(i, node)`, maintain the invariant that the trie path to `node` matches the pattern
prefix before `i`. An ordinary letter has exactly one possible continuation, while `.` has
all children as the exhaustive set of continuations. Recursing with `i + 1` preserves the
invariant. Once the pattern is exhausted, `is_word` is true exactly when the matched path
is a stored word, so search accepts precisely valid matches.

**Complexity**

- **Time:** `O(L)` for `addWord`. `search` is `O(L)` without wildcards and `O(26^L)` in
  the worst case for length `L` over the 26-letter alphabet.
- **Space:** `O(N)` for `N` stored characters, plus `O(L)` recursion space per search.
