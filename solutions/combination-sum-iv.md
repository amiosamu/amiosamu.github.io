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

Despite the name, this counts **permutations**: `(1,2,1)` and `(1,1,2)` are different answers.
That is what makes it a one-dimensional DP rather than a real combination problem — I never
need to remember which numbers I already used or in what order, only how much of the target is
left. So group every sequence by its *first* element: the number of ways to build `t` is the
sum, over each `num <= t`, of the ways to build `t - num`.

## Approach

1. Let `dp[t]` = the number of ordered sequences from `nums` that sum to exactly `t`. Allocate
   `dp` of length `target + 1`, all zeros.
2. Base case: `dp[0] = 1` — the empty sequence is the one way to make 0. This is the seed that
   every count ultimately traces back to.
3. Recurrence: `dp[t] = sum(dp[t - n] for n in nums if n <= t)`.
4. Iteration order: **target on the outside, numbers on the inside**, `t` ascending from `1` to
   `target`. This is the whole trick — the outer loop over `t` lets every number appear at every
   position, which counts orderings. Swapping the loops (numbers outside) would count each
   multiset once instead, i.e. true combinations.
5. Inside the inner loop, guard `n <= t` before indexing `dp[t - n]`.
6. Return `dp[target]`. The values are `nums` distinct positive integers, so no dedup is needed
   and nothing can loop forever on a zero.
7. Follow-up (negatives allowed): the state stops being well-founded — `[1, -1]` gives infinitely
   many sequences — so you would have to bound the sequence length and add that as a second
   dimension.

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

Every nonempty sequence summing to `t` has exactly one first element `n`, and deleting it
leaves a sequence summing to `t - n` — a bijection, so the sum over `n` counts each sequence
once and only once. Since all `nums` are positive, `t - n < t` and the ascending sweep has
`dp[t - n]` finalized before it is used. Filling `target` cells with an `O(n)` scan each is
`O(target * n)` time and `O(target)` space.
