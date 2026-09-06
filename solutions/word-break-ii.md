---
# Word Break II · Hard · Backtracking
# https://leetcode.com/problems/word-break-ii
draft: false
pattern: "DFS pruned by suffix-breakable table"
time: "O(n * L^2 + n * S)"
space: "O(n)"
---

## Description

Given a string `s` and a dictionary of strings `wordDict`, add spaces to `s` to build every sentence where each resulting word appears in `wordDict`, and return all such sentences in any order.

**Example**

```
Input: s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
Output: ["cats and dog","cat sand dog"]
```

Explanation: "catsanddog" can be split as "cats" + "and" + "dog" or as "cat" + "sand" + "dog", and both splits use only words found in `wordDict`.

## Intuition

Enumerating sentences is plain prefix-cut backtracking — the same shape as Palindrome Partitioning, with "is this piece in the dictionary" replacing "is this piece a palindrome". The reason naive backtracking blows up is the adversarial case `"aaaa...aaab"` with words `["a","aa","aaa",...]`: there are no valid sentences at all, yet the search rebuilds an exponential number of prefixes before discovering the trailing `b` is unusable every single time. The fix is to answer "can `s[i:]` be segmented at all?" once for each `i` in a linear DP pass, then use that table as a prune. With it, every branch the DFS enters is guaranteed to reach a real sentence, so the work becomes proportional to the output.

## Approach

1. Put `wordDict` in a set `words` for O(1) membership, and take `maxlen = max(map(len, wordDict))` so the piece loop never tries a length no word can have.
2. Precompute `breakable`, a list of `n + 1` booleans where `breakable[i]` means "`s[i:]` splits into dictionary words". Seed `breakable[n] = True` (the empty suffix) and fill **backwards** from `i = n - 1`: `breakable[i]` is true if some `end` in `i+1 .. min(n, i+maxlen)` has `s[i:end] in words and breakable[end]`. Break out of the inner loop as soon as one works.
3. Now the search. The decision at each node is where to cut next: take `s[start:end]` as the next word.
4. `path` holds the words chosen so far, always concatenating to exactly `s[:start]`; `res` collects finished sentences.
5. Base case: `start == n` — the string is consumed, so append `" ".join(path)`. The join is the copy step: `path` is one list mutated across the whole traversal, so joining snapshots it into a fresh immutable string that later `pop`s cannot disturb.
6. Pruning rule, and the whole point of the solution: only recurse when `word in words and breakable[end]`. The second test refuses to enter a subtree that provably contains no leaf, so no dead-end branch is ever explored.
7. Body: `path.append(word)`, `dfs(end)`, `path.pop()` — undo before trying a longer word at the same cut so `path` still describes the current node.
8. No duplicate rule is needed: distinct cut sequences are distinct sentences, so no two branches can produce the same string.

## Code

```python
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> List[str]:
        words = set(wordDict)
        maxlen = max(map(len, wordDict))
        n = len(s)

        breakable = [False] * (n + 1)
        breakable[n] = True
        for i in range(n - 1, -1, -1):
            for end in range(i + 1, min(n, i + maxlen) + 1):
                if s[i:end] in words and breakable[end]:
                    breakable[i] = True
                    break

        res, path = [], []

        def dfs(start: int) -> None:
            if start == n:
                res.append(" ".join(path))
                return
            for end in range(start + 1, min(n, start + maxlen) + 1):
                word = s[start:end]
                if word in words and breakable[end]:
                    path.append(word)
                    dfs(end)
                    path.pop()

        dfs(0)
        return res
```

## Why it works

The DP is correct by induction from the back: `s[i:]` is segmentable exactly when some dictionary word is a prefix of it and the remaining suffix is segmentable, which is precisely the recurrence filled in decreasing `i`. Given that, the prune is safe — it only skips cuts whose suffix admits no segmentation, so no sentence is lost — and it is also complete in the other direction: every node the DFS reaches has at least one descendant leaf, so the search does no wasted work. The DP costs O(n * L) candidate slices of O(L) each to hash, and the enumeration costs O(n) per emitted sentence, giving O(n * L^2 + n * S) for `S` sentences and `L` the longest dictionary word; auxiliary space is the `breakable` table and `path`, both O(n), though the returned list itself can be exponentially large.
