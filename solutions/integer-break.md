---
# Integer Break · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/integer-break/
draft: false
pattern: "Bottom-up DP over the first split"
time: "O(n^2)"
space: "O(n)"
---

## Description

Given an integer `n >= 2`, split it into at least two positive integers and return the
maximum possible product of those parts.

**Example**

```
Input: n = 10
Output: 36
```

Explanation: The split `3 + 3 + 4` has product `36`, which is maximal.

## Intuition

Choose one part `j` from a break of `i`. The remainder `i - j` may stay whole or be split
further. These choices produce `j * (i - j)` and `j * dp[i - j]`.

Taking the maximum over possible `j` covers every break. Testing only through `i // 2` is
sufficient because each split has at least one side no larger than half of `i`.

## Approach

1. Let `dp[i]` be the best product from splitting `i` into at least two positive parts.
   Set `dp[1] = 1` as a recurrence convenience.
2. Process each total `i` from `2` through `n`, so every smaller state is available.
3. For each `j` from `1` through `i // 2`, compare leaving `i - j` whole with using its
   best further split: `j * (i - j)` versus `j * dp[i - j]`.
4. Store the largest candidate in `dp[i]` and return `dp[n]`. The direct product term
   ensures every stored answer represents a real split.

## Code

```python
class Solution:
    def integerBreak(self, n: int) -> int:
        dp = [0] * (n + 1)
        dp[1] = 1

        for i in range(2, n + 1):
            for j in range(1, i // 2 + 1):
                dp[i] = max(dp[i], j * (i - j), j * dp[i - j])

        return dp[n]
```

## Why it works

Assume smaller DP states are optimal. Any break of `i` has some part `j <= i / 2`; the
remaining parts sum to `i - j`. They are either one whole part, covered by
`j * (i - j)`, or multiple parts whose product is at most `dp[i - j]`, covered by the
second term. Conversely, every candidate describes a valid break of `i`. Maximizing them
therefore yields exactly the optimum, completing induction through `n`.

**Complexity**

- **Time:** `O(n^2)` for the nested total-and-part loops.
- **Space:** `O(n)` for the DP array.
