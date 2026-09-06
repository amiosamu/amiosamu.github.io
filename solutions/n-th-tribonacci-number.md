---
# N-th Tribonacci Number · Easy · 1-D Dynamic Programming
# https://leetcode.com/problems/n-th-tribonacci-number/
draft: false
pattern: "Three rolling variables over a linear recurrence"
time: "O(n)"
space: "O(1)"
---

## Description

The Tribonacci sequence is defined by `T0 = 0`, `T1 = 1`, `T2 = 1`, and
`Tn = Tn-1 + Tn-2 + Tn-3` for `n >= 3`. Given `n`, return `Tn`.

**Example**

```
Input: n = 4
Output: 4
```

Explanation: `T3 = T2 + T1 + T0 = 1 + 1 + 0 = 2`, then `T4 = T3 + T2 + T1 = 2 + 1 + 1 = 4`.

## Intuition

The recurrence is handed to you; the only real decision is how to evaluate it. Naive recursion
recomputes the same subtrees and costs O(3^n), memoization fixes that but drags in a dict and
`n` stack frames. Since `T(i)` reads exactly the three cells below it and nothing further back,
a bottom-up sweep carrying a three-element window is enough — no table, no recursion.

## Approach

1. State: `dp[i]` is the `i`-th Tribonacci number, i.e. the value of the sequence at index `i`.
2. Recurrence: `dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3]`, valid for `i >= 3`.
3. Base cases: `dp[0] = 0`, `dp[1] = 1`, `dp[2] = 1`. Handle `n < 3` up front with an early
   return — `return 0 if n == 0 else 1` — because the sliding window below assumes at least
   three seeds exist.
4. Iteration direction: increasing `i` from `3` to `n`, so all three terms are already final.
5. Answer: `dp[n]`.
6. Collapse the table to `a, b, c = dp[i - 3], dp[i - 2], dp[i - 1]`, seeded to `0, 1, 1`, and
   slide once per index with the simultaneous assignment `a, b, c = b, c, a + b + c`. After the
   loop finishes at `i = n`, `c` holds `dp[n]`.
7. Return `c`. Python ints are arbitrary precision, so the 32-bit overflow caveat in the problem
   statement is not a concern here.

## Code

```python
class Solution:
    def tribonacci(self, n: int) -> int:
        if n < 3:
            return 0 if n == 0 else 1

        a, b, c = 0, 1, 1

        for _ in range(3, n + 1):
            a, b, c = b, c, a + b + c

        return c
```

## Why it works

The invariant is that at the top of each iteration `(a, b, c)` equals `(dp[i - 3], dp[i - 2],
dp[i - 1])`; the simultaneous assignment computes the new `c` from the *old* three values before
any of them are overwritten, which re-establishes the invariant for `i + 1`. Since the
recurrence reaches back exactly three positions, that window carries all the information the
full table would. One addition per index: O(n) time, three integers of state: O(1) space.
