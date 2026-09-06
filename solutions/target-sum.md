---
# Target Sum · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/target-sum/
draft: false
pattern: "Count sign assignments by running sum"
time: "O(n * S)"
space: "O(S)"
---

## Description

Given an array of integers `nums` and an integer `target`, describes assigning a `+` or `-`
sign to each number in `nums` and summing the results; returns the number of distinct sign
assignments that make the sum equal exactly `target`.

**Example**

```
Input: nums = [1,1,1,1,1], target = 3
Output: 5
```

Explanation: to reach a sum of 3 from five 1s, four must be `+1` and one must be `-1`
(4 - 1 = 3); there are 5 ways to choose which single 1 gets the minus sign.

## Intuition

There are `2^n` sign assignments, but many of them agree on the one thing that matters: the
running sum after the first `i` numbers. Nothing downstream cares which signs produced that
sum, only what it is, so all assignments sharing a prefix sum can be merged into a single count.
The running sum lives in `[-sum(nums), +sum(nums)]`, so instead of `2^n` branches I carry a map
from reachable sum to how many assignments reach it.

## Approach

1. `dp[i][t]` is the number of `+`/`-` assignments to the first `i` numbers whose running sum is
   exactly `t`, considering only `nums[:i]`.
2. Recurrence, two cases — number `i` gets a `+` or a `-`, and these are disjoint:
   `dp[i][t] = dp[i-1][t - nums[i]] + dp[i-1][t + nums[i]]`.
3. Base case: the padding row `dp[0][0] = 1` (the empty prefix sums to zero in exactly one way),
   all other `dp[0][t] = 0`.
4. Represent each row as a dict `ways` keyed by reachable sum, which is just the 2-D table with
   the zero cells omitted — it also sidesteps the negative-index problem a list would have.
   Start with `ways = {0: 1}`.
5. Iterate over `nums` **forward**. For each `n`, build a fresh `collections.defaultdict(int)`
   named `nxt`, and for every `(total, count)` in `ways` add `count` into both
   `nxt[total + n]` and `nxt[total - n]`. Then replace `ways` with `nxt`.
6. Building into a *separate* dict is what enforces the row order: mutating `ways` in place
   would let a number be applied twice within one pass.
7. Note `nums[i]` may be `0`, in which case `+0` and `-0` land on the same key and correctly
   contribute `2 * count` — the dict addition handles it with no special case.
8. Return `ways.get(target, 0)`; an unreachable target simply has no key.

## Code

```python
import collections

class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        ways = {0: 1}

        for n in nums:
            nxt = collections.defaultdict(int)
            for total, count in ways.items():
                nxt[total + n] += count
                nxt[total - n] += count
            ways = nxt

        return ways.get(target, 0)
```

## Why it works

Every assignment has a definite sign for `nums[i]`, so splitting on it partitions the
assignments into two disjoint groups counted by the two predecessor cells — exhaustive, no
double counting. Merging assignments by running sum is legal precisely because the remaining
choices and the final total depend only on the sum so far, not on the signs that produced it,
which is the path-independence that licenses the DP. Each row holds at most `2S + 1` distinct
sums for `S = sum(nums)`, and there are `n` rows with `O(1)` work per entry: `O(n * S)` time and
`O(S)` space.
