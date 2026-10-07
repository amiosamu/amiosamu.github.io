---
# Word Break · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/word-break/
draft: false
pattern: "Suffix DP over dictionary prefixes"
time: "O(n * m * k)"
space: "O(n)"
---

## Description

Given a string and a dictionary, determine whether the entire string can be segmented into one or
more dictionary words. Words may be reused.

**Example**

```
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
```

`"leetcode"` is the concatenation of the dictionary words `"leet"` and `"code"`.

## Intuition

A greedy word choice can strand a suffix even when another choice succeeds. The relevant state is
only the next string index. A suffix is segmentable if some dictionary word matches its prefix and
the suffix after that word is also segmentable.

## Approach

1. Let `dp[i]` mean that suffix `s[i:]` can be segmented.
2. Set `dp[n] = True` because consuming the whole string is a successful base case.
3. Fill indices from right to left so every later suffix state is already final.
4. For each dictionary word `w`, set `dp[i]` when `w` matches at `i` and `dp[i + len(w)]`
   is true; stop after the first witness.
5. Return `dp[0]`, the state for the complete string.

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

Use backward induction on `i`. The empty suffix at `n` is segmentable. For an earlier suffix, any
valid segmentation begins with one dictionary word and leaves a segmentable later suffix; the
recurrence tests every possible first word. Conversely, any matching word followed by a true DP
state constructs a valid segmentation. Thus every state, including `dp[0]`, is correct.

**Complexity**

- **Time:** `O(n * m * k)` for `m` words of maximum length `k`.
- **Space:** `O(n)` for the DP array.
