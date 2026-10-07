---
# N-th Tribonacci Number · Easy · 1-D Dynamic Programming
# https://leetcode.com/problems/n-th-tribonacci-number/
draft: false
pattern: "Three rolling variables over a linear recurrence"
time: "O(n)"
space: "O(1)"
---

## Description

The Tribonacci sequence has `T0 = 0`, `T1 = 1`, `T2 = 1`, and
`Tn = Tn-1 + Tn-2 + Tn-3` for `n >= 3`. Given `n`, return `Tn`.

**Example**

```
Input: n = 4
Output: 4
```

Explanation: `T3 = 2`, so `T4 = T3 + T2 + T1 = 2 + 1 + 1 = 4`.

## Intuition

Each term depends only on the previous three terms. A bottom-up computation therefore needs a
three-value window rather than a full dynamic-programming table or a recursive call tree. After
computing the next term, shift the window forward by one index.

## Approach

1. Return the corresponding seed directly when `n < 3`.
2. Initialize `(a, b, c)` to `(T0, T1, T2) = (0, 1, 1)`.
3. For each index from `3` through `n`, simultaneously assign
   `(a, b, c) = (b, c, a + b + c)`.
4. Return `c`, which is the final term. Python integers handle the required values directly.

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

Before the iteration for index `i`, `(a, b, c) = (T(i - 3), T(i - 2), T(i - 1))`. The
simultaneous assignment retains the latter two values and computes `T(i)` from all three old
values, so the invariant holds for `i + 1`. By induction, after processing index `n`, `c = Tn`.
The explicit base cases cover iterations that never begin.

**Complexity**

- **Time:** `O(n)` iterations.
- **Space:** `O(1)` auxiliary space.
