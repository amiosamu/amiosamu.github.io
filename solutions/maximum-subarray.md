---
# Maximum Subarray · Medium · Greedy
# https://leetcode.com/problems/maximum-subarray/
draft: false
pattern: "Kadane, drop negative prefixes"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array `nums`, returns the largest possible sum of a contiguous subarray that
contains at least one number.

**Example**

```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
```

Explanation: the subarray `[4,-1,2,1]` sums to 6, which is the largest sum among all
contiguous subarrays of `nums`.

## Intuition

The brute force checks all O(n²) subarrays. The insight that kills it: if the running sum of the
piece I am currently extending has gone negative, that whole piece is dead weight — any subarray
that starts before the current index and carries a negative prefix into it is strictly beaten by
the same subarray with the prefix cut off. So there is never a reason to keep a negative running
sum around. That turns the search into a single scan where at each index I only ask: extend the
current piece, or restart from here?

## Approach

1. Track `cur`, the best sum of a subarray that *ends at the current index*, and `best`, the answer
   so far. Seed both with `nums[0]` — the subarray must be non-empty, so 0 is not a valid seed.
2. Walk `nums[1:]` as `n`.
3. `cur = max(n, cur + n)`. The two options are the only two: either `n` joins the piece ending at
   the previous index, or it starts a fresh piece. `max(n, cur + n)` is exactly "restart when
   `cur` is negative".
4. `best = max(best, cur)` after each update — `cur` is a candidate answer at every index, and the
   optimum ends *somewhere*, so taking the max over all endpoints covers every subarray.
5. Return `best`. All-negative inputs fall out correctly because `cur` restarts at each element and
   `best` keeps the largest single element.

## Code

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        best = cur = nums[0]

        for n in nums[1:]:
            cur = max(n, cur + n)
            best = max(best, cur)

        return best
```

## Why it works

The invariant is that `cur` is the true maximum over all subarrays ending at index `i`. That holds
by induction: such a subarray is either `nums[i]` alone or `nums[i]` appended to a subarray ending
at `i-1`, and the best of the latter kind is `cur + nums[i]` by the hypothesis — no other candidate
exists, so discarding everything else discards nothing. The safety of the greedy restart is the
same fact stated backwards: a prefix with negative sum can never be part of a maximum subarray,
because deleting it strictly increases the total. Every subarray has exactly one endpoint, so
maximising over endpoints in one O(n) pass with two scalars finds the global optimum.
