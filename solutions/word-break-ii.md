---
# Word Break II · Hard · Backtracking
# https://leetcode.com/problems/word-break-ii
draft: false
pattern: "DFS pruned by suffix-breakable table"
time: "O(D + n * L^2 * (S + 1))"
space: "O(n + d)"
---

## Description

Given `s` and `wordDict`, insert spaces to produce every sentence whose words all belong to the
dictionary. Return the sentences in any order.

**Example**

```
Input: s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
Output: ["cats and dog","cat sand dog"]
```

The string has exactly the two shown segmentations into dictionary words.

## Intuition

Backtracking naturally enumerates every sequence of prefix cuts, but it can repeatedly explore
suffixes that cannot produce a sentence. Precompute whether each suffix is segmentable, then enter
only branches whose remainder can finish. The DFS still generates every valid sentence while
avoiding dead subtrees.

## Approach

1. Store the dictionary in `words` and compute `maxlen` to bound all substring checks.
2. Fill `breakable` from right to left, where `breakable[i]` means that `s[i:]` has at least
   one dictionary segmentation.
3. In `dfs(start)`, try every next word ending no farther than `start + maxlen`.
4. Recurse only when the candidate is in `words` and `breakable[end]` is true.
5. Append a completed sentence with `" ".join(path)`; after recursion, pop the chosen word so
   the shared path again represents the current prefix.

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

Backward induction proves `breakable[i]`: a suffix is segmentable exactly when some dictionary
prefix ends at `end` and `breakable[end]` is true. During DFS, `path` concatenates to `s[:start]`.
Every accepted cut preserves that invariant and has a finishable suffix. Conversely, every valid
sentence's next word passes both tests, so induction over its cuts shows that DFS reaches and emits
it. Distinct cut sequences produce distinct sentences, so none is duplicated.

**Complexity**

- **Time:** `O(D + n * L^2 * (S + 1))` as an upper bound, where `D` is the total number of
  dictionary characters, `L` is the maximum word length, and `S` is the number of returned
  sentences. Slicing and hashing cost up to `O(L)`.
- **Space:** `O(n + d)` auxiliary space for DP, recursion/path, and `d` dictionary entries.
- **Output:** `O(n * S)` characters in the returned sentences.
