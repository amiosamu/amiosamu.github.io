---
# Extra Characters in a String · Medium · Tries
# https://leetcode.com/problems/extra-characters-in-a-string/
draft: false
pattern: "Suffix DP over trie walk"
time: "O(n^2 + m)"
space: "O(n + m)"
---

## Description

Given a string `s` and a dictionary, cover characters with non-overlapping dictionary
words and return the minimum number of characters left uncovered.

**Example**

```
Input: s = "leetscode", dictionary = ["leet","code","leetcode"]
Output: 1
```

Choosing `"leet"` and `"code"` leaves only the `s` at index 4 uncovered.

## Intuition

At index `i`, either leave `s[i]` uncovered or consume a dictionary word that starts
there. The best result after either choice depends only on a later suffix, so compute a
suffix dynamic program from right to left.

A trie finds all dictionary words beginning at `i` in one forward walk. As soon as a
character has no trie edge, no longer word can match that start. Adding the same dictionary
word more than once only rewrites its terminal marker and does not affect the result.

## Approach

1. Build a trie of dictionary words and mark terminal nodes with `'$'`.
2. Define `dp[i]` as the minimum uncovered characters in `s[i:]`, with `dp[n] = 0`.
3. Fill indices right to left. Start with `dp[i] = 1 + dp[i + 1]`, which leaves
   `s[i]` uncovered.
4. Walk the trie along `s[i:]`. At every terminal node ending at `j`, relax with
   `dp[j + 1]`, because the matched word contributes no extra characters.
5. Stop when the trie path fails and return `dp[0]` after all suffixes are computed. The
   empty input returns the initialized value `dp[0] = 0`.

## Code

```python
class Solution:
    def minExtraChar(self, s: str, dictionary: List[str]) -> int:
        root = {}
        for w in dictionary:
            node = root
            for ch in w:
                node = node.setdefault(ch, {})
            node['$'] = True

        n = len(s)
        dp = [0] * (n + 1)
        for i in range(n - 1, -1, -1):
            dp[i] = dp[i + 1] + 1
            node = root
            for j in range(i, n):
                if s[j] not in node:
                    break
                node = node[s[j]]
                if '$' in node:
                    dp[i] = min(dp[i], dp[j + 1])
        return dp[0]
```

## Why it works

Induct from the empty suffix. Any optimal treatment of `s[i:]` either leaves its first
character uncovered or covers it with a dictionary word ending at some `j`. These cases
are exhaustive, with costs `1 + dp[i + 1]` and `dp[j + 1]`, respectively. The trie
enumerates exactly the valid second-case words, and all referenced suffixes are already
optimal. Taking their minimum therefore computes the optimum at `i` without overlap.

**Complexity**

- **Time:** `O(m + n^2)` in the worst case, where `m` is the total dictionary length.
- **Space:** `O(m + n)` for the trie and DP array.
