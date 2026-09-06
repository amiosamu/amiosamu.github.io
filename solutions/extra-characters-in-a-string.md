---
# Extra Characters in a String · Medium · Tries
# https://leetcode.com/problems/extra-characters-in-a-string/
draft: false
pattern: "Suffix DP over trie walk"
time: "O(n^2 + m)"
space: "O(n + m)"
---

## Intuition

Trying every way to cut `s` into dictionary words explodes, but the choice at index `i` only depends on the suffix `s[i:]` — the characters before `i` cannot change which words start at `i`. So `dp[i] = ` minimum extra characters in `s[i:]`, and at each `i` there are just two kinds of move: leave `s[i]` unmatched, or consume a dictionary word starting at `i`. The trie is what makes the second move cheap: instead of slicing `s[i:j]` and hashing it against the dictionary for every `j`, I walk one node per character from `i` and read off every dictionary word starting at `i` in a single scan — and the walk dies the moment the prefix leaves the trie.

## Approach

1. Build the trie as nested dicts. For each `w` in `dictionary`, descend from `root` with `node = node.setdefault(ch, {})`, then mark the terminal node with `node['$'] = True`. Using `'$'` as the end marker is safe because `s` and the dictionary are lowercase letters only.
2. Let `n = len(s)` and allocate `dp = [0] * (n + 1)`. `dp[i]` is the fewest extra characters in `s[i:]`; `dp[n] = 0` since the empty suffix wastes nothing.
3. Fill `dp` backwards, `i` from `n - 1` down to `0`, so every `dp[j + 1]` a transition needs is already final.
4. Baseline first: `dp[i] = dp[i + 1] + 1`, meaning `s[i]` is left over. This is always legal, so `dp[i]` is never unset.
5. Then walk the trie from `root` with `j` running from `i` upward. Break out as soon as `s[j]` is not a key of `node` — no longer word can start at `i` past that point. Otherwise descend, and whenever `'$' in node` the substring `s[i..j]` is a dictionary word, so relax `dp[i] = min(dp[i], dp[j + 1])`.
6. Return `dp[0]`.
7. Note the relaxation uses `dp[j + 1]` and not `dp[j]` — `j` is the last index *inside* the matched word, so the untouched suffix begins at `j + 1`. Off-by-one here is the only real trap.

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

Any optimal partition of `s[i:]` either leaves `s[i]` extra — cost `1 + dp[i + 1]` — or covers `s[i]` with a dictionary word ending at some `j`, cost `dp[j + 1]` since the word itself contributes nothing. Those cases are mutually exhaustive and each recurses on a strictly shorter suffix already computed, so the backwards fill is correct by induction, and the substrings are non-overlapping by construction because each transition jumps past the characters it consumed. The trie walk from each `i` runs at most `n` steps with O(1) dict work per step, giving O(n^2) after the O(m) build over the dictionary's `m` total characters.
