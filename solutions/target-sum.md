---
# Target Sum · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/target-sum/
draft: false
pattern: "Count sign assignments by running sum"
time: "O(n * S)"
space: "O(S)"
---

## Description

Given `nums` and `target`, assign either `+` or `-` before every number. Return the number of
distinct sign assignments whose resulting expression equals `target`.

**Example**

```
Input: nums = [1,1,1,1,1], target = 3
Output: 5
```

Four values must be positive and one negative. There are five choices for the negative value.

## Intuition

Many sign assignments produce the same running sum after a prefix. Their future choices are
identical, so aggregate them into one map entry whose value is the number of ways to reach that
sum. Each new number sends every current count to two next sums.

## Approach

1. Let `ways[total]` count sign assignments for the processed prefix that produce `total`.
2. Initialize `ways = {0: 1}` for the empty prefix.
3. For each value `n`, build a fresh map `nxt`; add each count to both `total + n` and
   `total - n`.
4. Replace `ways` only after processing the whole layer so `n` is used exactly once.
5. Return `ways.get(target, 0)`. When `n == 0`, both branches correctly add to the same key.

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

After processing `i` values, maintain the invariant that `ways[t]` equals the number of sign
assignments for `nums[:i]` that total `t`. It holds initially for the empty prefix. Every existing
assignment extends uniquely by choosing `+nums[i]` or `-nums[i]`, and the two updates record those
two choices. Thus the invariant holds by induction, and at the end the target entry is exactly the
required count.

**Complexity**

- **Time:** `O(n * S)`, where `S = sum(nums)` bounds the range of reachable sums.
- **Space:** `O(S)` for the current and next maps.
