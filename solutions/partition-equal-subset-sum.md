---
# Partition Equal Subset Sum · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/partition-equal-subset-sum/
draft: false
pattern: "0/1 knapsack on reachable sums"
time: "O(n * S)"
space: "O(S)"
---

## Intuition

Two subsets that split evenly means each one sums to `total / 2`, so the second subset is just
the complement — I only ever need to find *one* subset hitting `target = total // 2`. An odd
total is immediately impossible. What is left is the subset-sum decision problem: which totals
in `0..target` are reachable using each number at most once. The reachable set is small
(`target + 1` booleans), which is why an exponential subset search collapses to a table.

## Approach

1. `total = sum(nums)`; if `total % 2` is nonzero, return `False` — no split can be equal.
2. Set `target = total // 2`. Let `dp` be a boolean list of length `target + 1` where `dp[t]`
   is `True` iff some subset of the numbers processed so far sums to exactly `t`.
3. Base case: `dp[0] = True` (the empty subset), everything else `False`.
4. Recurrence, processing one number `n` at a time: `dp[t] = dp[t] or dp[t - n]` for every
   `t >= n` — either skip `n` or use it once on top of a sum of `t - n`.
5. Iteration order matters: the inner loop runs `t` **downward**, `range(target, n - 1, -1)`.
   Descending means `dp[t - n]` still holds the value from *before* `n` was introduced, which
   is what keeps each number to a single use. An ascending loop would silently turn this into
   unbounded knapsack.
6. Early exit: after finishing a number, if `dp[target]` is `True` return `True`.
7. Return `dp[target]` after all numbers.

## Code

```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False

        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True

        for n in nums:
            for t in range(target, n - 1, -1):
                dp[t] = dp[t] or dp[t - n]
            if dp[target]:
                return True

        return dp[target]
```

## Why it works

`dp` is the exact set of subset sums of the prefix processed so far, maintained inductively:
adding `n` extends every reachable sum `t - n` to `t`, and the descending sweep guarantees the
`dp[t - n]` being read belongs to the previous prefix, so `n` is never counted twice within one
subset. Reaching `target` therefore certifies a real subset, whose complement sums to `target`
too. `n` numbers times `S = total // 2` cells gives `O(n * S)` time and `O(S)` space — this is
pseudo-polynomial, which is fine here because the constraints cap `total` at 20000.
