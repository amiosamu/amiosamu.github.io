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

Every way to reach step `i` ends with either one step from `i - 1` or two steps from `i - 2`.
These cases are disjoint and cover every climb, so their counts add. Only the previous two
counts are needed, making a full dynamic-programming array unnecessary.

## Approach

1. Treat `dp[0] = 1` as the empty climb and `dp[1] = 1` as the single one-step climb.
2. Store those values in `prev` and `cur`, representing `dp[i - 2]` and `dp[i - 1]`.
3. For each step from 2 through `n`, update both values simultaneously with
   `prev, cur = cur, cur + prev`.
4. Return `cur`. For `n = 1`, the loop is empty and the initial value is already correct.

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

Before each iteration for step `i`, `prev` and `cur` equal the numbers of ways to reach steps
`i - 2` and `i - 1`. The recurrence makes their sum the exact count for step `i`, while the
simultaneous assignment shifts the window and preserves the invariant. The base values start
the induction, so the returned value is the number of climbs to step `n`.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(1)` auxiliary space.
