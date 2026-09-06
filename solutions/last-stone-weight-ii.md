---
# Last Stone Weight II · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/last-stone-weight-ii/
draft: false
pattern: "Minimize partition gap via subset sum"
time: "O(n * S)"
space: "O(S)"
---

## Intuition

Smashing `x` and `y` leaves `|x - y|`, which is the same as putting one on the plus side and
one on the minus side of a running expression. Chain the smashes and the final stone is
`|sum of ±stone[i]|` for some choice of signs — every sign assignment is achievable and every
smash sequence produces one. So the task is to split the stones into two groups and minimize
`|A - B|`. With `A + B = total`, minimizing the gap means pushing the smaller group's sum `t`
as close to `total // 2` as possible, and the answer is `total - 2 * t`.

## Approach

1. Compute `total = sum(stones)` and `target = total // 2`.
2. `dp[i][t]` is `True` iff some subset of the first `i` stones sums to exactly `t`, considering
   only those `i` stones — which stones were chosen does not matter, only the sum.
3. Recurrence, two cases: stone `i` is skipped (`dp[i-1][t]`) or used once
   (`dp[i-1][t - stones[i]]`, valid only when `t >= stones[i]`), so
   `dp[i][t] = dp[i-1][t] or dp[i-1][t - stones[i]]`.
4. Base case: the padding row `dp[0][0] = True` (empty subset sums to zero), `dp[0][t] = False`
   for `t > 0`.
5. Roll to a single boolean array `dp` of length `target + 1` with `dp[0] = True`. For each
   stone `s`, sweep `t` **downward** through `range(target, s - 1, -1)`. Descending guarantees
   `dp[t - s]` still holds the previous row's value, so each stone is used at most once; an
   ascending sweep would let a stone be reused and turn this into unbounded knapsack.
6. After all stones, scan `t` from `target` down to `0` and return `total - 2 * t` for the first
   reachable `t`. That is the largest achievable sum not exceeding half.
7. The loop always terminates because `dp[0]` is `True`, so no fallback return is needed.

## Code

```python
class Solution:
    def lastStoneWeightII(self, stones: List[int]) -> int:
        total = sum(stones)
        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True

        for s in stones:
            for t in range(target, s - 1, -1):
                if dp[t - s]:
                    dp[t] = True

        for t in range(target, -1, -1):
            if dp[t]:
                return total - 2 * t
```

## Why it works

Any smash order is an assignment of `+`/`-` signs to the stones and vice versa, so the reachable
final weights are exactly `|total - 2t|` over reachable subset sums `t`; restricting the search
to `t <= total // 2` loses nothing because the two groups are symmetric. `dp` is maintained as
the exact set of subset sums of the prefix processed so far, and the descending sweep keeps the
read `dp[t - s]` on the previous prefix so no stone is double counted. The state is just the
running sum, independent of which subset produced it, giving `O(n * S)` time and `O(S)` space
for `S = total // 2` — pseudo-polynomial, fine because the constraints cap `total` at 3000.
