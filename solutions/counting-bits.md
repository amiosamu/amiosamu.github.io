---
# Counting Bits · Easy · Bit Manipulation
# https://leetcode.com/problems/counting-bits/
draft: false
pattern: "DP on i >> 1 plus low bit"
time: "O(n)"
space: "O(1)"
---

## Intuition

Calling popcount on each of the `n + 1` values costs O(n log n). The insight is that `i` in
binary is just `i >> 1` with one extra bit glued on the right, so
`popcount(i) = popcount(i >> 1) + (i & 1)`. Since `i >> 1 < i` for every `i >= 1`, the answer
for `i` is already sitting in the table when I reach it — a one-line DP, left to right.

## Approach

1. Allocate `dp = [0] * (n + 1)`; `dp[0] = 0` is already correct and is the base case.
2. For `i` from `1` to `n`, set `dp[i] = dp[i >> 1] + (i & 1)`.
3. `i >> 1` drops the least significant bit; `i & 1` adds back the 1 if that dropped bit was set.
4. Return `dp`.
5. Trace `n = 5`: `dp[1] = dp[0] + 1 = 1`, `dp[2] = dp[1] + 0 = 1`, `dp[3] = dp[1] + 1 = 2`,
   `dp[4] = dp[2] + 0 = 1`, `dp[5] = dp[2] + 1 = 2`, giving `[0,1,1,2,1,2]`.
6. Edge case `n = 0` returns `[0]` because the loop body never runs.

## Code

```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
        return dp
```

## Why it works

Every non-negative `i` factors uniquely as `2 * (i >> 1) + (i & 1)`, and multiplying by 2 is a
left shift that moves bits without creating or destroying any, so the set-bit count of `i` is the
count of `i >> 1` plus the low bit. The recurrence only reads a strictly smaller index, so a
single forward pass fills the table in O(n) time with O(1) auxiliary space beyond the output.
