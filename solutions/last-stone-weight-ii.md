---
# Last Stone Weight II · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/last-stone-weight-ii/
draft: false
pattern: "Minimize partition gap via subset sum"
time: "O(n * S)"
space: "O(S)"
---

## Description

Given stone weights, repeatedly choose two stones to smash. Equal stones both disappear;
otherwise the lighter stone disappears and the heavier becomes their weight difference.
Return the smallest possible final weight, or `0` if no stone remains.

**Example**

```
Input: stones = [2,7,4,1,8,1]
Output: 1
```

Partitioning the stones into sums `11` (`2 + 8 + 1`) and `12` (`7 + 4 + 1`) leaves a
difference of `1`, and no partition can produce `0` because the total weight is odd.

## Intuition

Each smash replaces two weights by their absolute difference. Repeated smashes therefore assign
each original stone to one of two sides of a subtraction, making the final weight the difference
between two subset sums. To minimize that difference, find the largest achievable subset sum no
greater than half of the total weight.

## Approach

1. Compute `total` and set `target = total // 2`.
2. Let `dp[t]` mean that a subset of the processed stones has sum `t`; initialize `dp[0]`.
3. For each stone `s`, scan `t` downward and set `dp[t]` when `dp[t - s]` was reachable.
4. The descending order prevents one stone from being reused during its own iteration.
5. Find the greatest reachable `t <= target` and return `total - 2 * t`. Since `dp[0]` is true,
   such a sum always exists.

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

A sequence of differences expands to an absolute signed sum of the original weights, so its final
weight equals `|total - 2t|` for one subset sum `t`. Conversely, stones on each side can be reduced
within their groups and then smashed across groups, realizing that difference. The descending
update makes `dp` contain exactly the subset sums using each processed stone at most once. By
symmetry, an optimal side has sum at most `total / 2`; choosing the greatest reachable such sum
minimizes `total - 2t`.

**Complexity**

- **Time:** `O(n * S)`, where `S = floor(sum(stones) / 2)`.
- **Space:** `O(S)` for the subset-sum array.
