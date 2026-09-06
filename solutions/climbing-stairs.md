---
# Climbing Stairs · Easy · 1-D Dynamic Programming
# https://leetcode.com/problems/climbing-stairs/
draft: false
pattern: "Fibonacci recurrence, two rolling variables"
time: "O(n)"
space: "O(1)"
---

## Description

Given a staircase of `n` steps, where each move climbs either 1 or 2 steps, return the
number of distinct sequences of moves that reach the top exactly.

**Example**

```
Input: n = 3
Output: 3
```

Explanation: The three distinct ways are `1+1+1`, `1+2`, and `2+1`.

## Intuition

Enumerating every sequence of 1s and 2s is exponential, but the sequences that reach step `i`
split cleanly by their *last* move: it was either a 1-step from `i - 1` or a 2-step from
`i - 2`, never both, and every way of reaching those steps extends uniquely. So the count at
`i` is the sum of the counts at the two steps below it — this is Fibonacci wearing a staircase
costume, and nothing about *how* you got to a step matters beyond the step number itself.

## Approach

1. State: `dp[i]` is the number of distinct ways to reach step `i` from the ground, considering
   only moves of size 1 and 2.
2. Recurrence: `dp[i] = dp[i - 1] + dp[i - 2]`. The two terms are disjoint (they differ in the
   final move) and exhaustive (there is no other final move).
3. Base cases: `dp[0] = 1` — one way to stand at the bottom, the empty sequence — and
   `dp[1] = 1`. Getting `dp[0] = 1` rather than `0` is what makes `dp[2] = 2` come out right.
4. Iteration direction: increasing `i`, from `2` up to `n`, so both terms on the right are
   already final when read.
5. Answer: `dp[n]`.
6. The table is never read more than two cells back, so collapse it to `prev = dp[i - 2]` and
   `cur = dp[i - 1]`, both seeded to `1`, and slide them with the tuple assignment
   `prev, cur = cur, cur + prev` on each iteration.
7. Return `cur`. With `n = 1` the loop body never runs and `cur` is still the base case `1`,
   which is correct.

## Code

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        prev, cur = 1, 1

        for _ in range(2, n + 1):
            prev, cur = cur, cur + prev

        return cur
```

## Why it works

Every climb that ends on step `i` has a last move, and that move is a 1 or a 2, so the set of
climbs to `i` is the disjoint union of (climbs to `i - 1` plus a 1) and (climbs to `i - 2` plus
a 2) — the recurrence counts each climb exactly once. The rolling pair is a faithful window on
the table because the recurrence never looks further back than two cells, and the simultaneous
assignment writes the new `cur` from the *old* `prev`. One pass, two integers: O(n) time, O(1)
space.
