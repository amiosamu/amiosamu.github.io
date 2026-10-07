---
# Combination Sum IV · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/combination-sum-iv/
draft: false
pattern: "Counting DP over target, permutations"
time: "O(target * n)"
space: "O(target)"
---

## Description

Given an array of distinct positive integers and a target, count how many ordered sequences of
those numbers (with repetition allowed) sum to exactly the target — sequences that use the same
numbers in a different order count as different answers.

**Example**

```
Input: nums = [1,2,3], target = 4
Output: 7
```

Explanation: the 7 ordered sequences summing to 4 are `(1,1,1,1)`, `(1,1,2)`, `(1,2,1)`,
`(2,1,1)`, `(2,2)`, `(1,3)`, and `(3,1)`.

## Intuition

Order matters: `(1, 2, 1)` and `(1, 1, 2)` are different sequences. Group sequences totaling
`t` by their last number `num`. Removing that final number leaves any sequence totaling
`t - num`, so summing those counts gives the count for `t`.

## Approach

1. Let `dp[t]` count ordered sequences totaling `t`, and set `dp[0] = 1` for the empty prefix.
2. Process totals `t` from 1 through `target`; positivity guarantees every `t - num` is a
   smaller, already-computed state.
3. For every `num <= t`, add `dp[t - num]` to `dp[t]`. Keeping totals outside the number loop
   allows every number at every final position, so orderings remain distinct.
4. Return `dp[target]`. Distinct positive input values require no deduplication, and the input
   is not mutated.

## Code

```python
class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        dp = [0] * (target + 1)
        dp[0] = 1

        for t in range(1, target + 1):
            for n in nums:
                if n <= t:
                    dp[t] += dp[t - n]

        return dp[target]
```

## Why it works

Every nonempty sequence totaling `t` has one final value `num`. Removing it gives a unique
sequence counted by `dp[t - num]`, while appending `num` reverses that operation. These groups
are disjoint for different final values and cover every sequence. Induction on `t`, starting
from the empty sequence at zero, proves that each `dp[t]` is exact.

**Complexity**

- **Time:** `O(target * n)`, where `n = len(nums)`.
- **Space:** `O(target)`.
