---
# Word Break · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/word-break/
draft: false
pattern: "Suffix DP over dictionary prefixes"
time: "O(n * m * k)"
space: "O(n)"
---

## Intuition

Greedily matching the longest word fails — `"aaaaaab"` with `["aaaa", "aaa", "b"]` needs
`aaa + aaa + b`, but grabbing `aaaa` first strands `"aab"`. The fix is that the only thing that matters after consuming a prefix is
*where the cut landed*, not which words got you there. So there are only `n + 1` distinct
states, and `s` is breakable from position `i` if some dictionary word sits at `i` and the
rest of the string is breakable from where that word ends.

## Approach

1. Let `n = len(s)`. Build `dp` of length `n + 1`, where `dp[i]` is `True` iff the suffix
   `s[i:]` can be segmented entirely into dictionary words.
2. Base case: `dp[n] = True` — the empty suffix is trivially segmented. Everything else starts
   `False`.
3. Recurrence: `dp[i] = OR over words w of (s[i:i+len(w)] == w and dp[i + len(w)])`.
4. Iteration order is **right to left**, `i` from `n - 1` down to `0`, so `dp[i + len(w)]` is
   always already computed when it is read.
5. Inside, loop over every `w` in `wordDict`, guard with `i + len(w) <= n` before slicing, and
   `break` on the first success — one witness is enough.
6. Return `dp[0]`.
7. If the dictionary is large, hoist it into a `set` and instead loop `j` from `i + 1` to `n`
   testing `s[i:j] in words`; same recurrence, the cost just shifts from word count to
   substring length.

## Code

```python
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        n = len(s)
        dp = [False] * (n + 1)
        dp[n] = True

        for i in range(n - 1, -1, -1):
            for w in wordDict:
                if i + len(w) <= n and s[i : i + len(w)] == w and dp[i + len(w)]:
                    dp[i] = True
                    break

        return dp[0]
```

## Why it works

Any valid segmentation of `s[i:]` starts with exactly one dictionary word, so the recurrence
enumerates every possible first word and defers the rest to a strictly shorter suffix — the
cases are exhaustive and non-overlapping, and the recursion is well-founded because every word
has positive length. The right-to-left order guarantees each `dp[i + len(w)]` is final when
read. There are `n` states, each scanning `m = len(wordDict)` words with an `O(k)` comparison
for `k` the longest word: `O(n * m * k)` time, `O(n)` space.
