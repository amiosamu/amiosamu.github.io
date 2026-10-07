---
# Merge Triplets to Form Target Triplet · Medium · Greedy
# https://leetcode.com/problems/merge-triplets-to-form-target-triplet/
draft: false
pattern: "Discard triplets that overshoot target"
time: "O(n)"
space: "O(1)"
---

## Description

Given integer triplets and a target triplet, determine whether repeated elementwise-maximum merges
can produce exactly `target`.

**Example**

```
Input: triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]
Output: true
```

Merging `[2,5,3]` with `[1,7,5]` gives the target `[2,7,5]`.

## Intuition

Elementwise maximum is monotone: once a coordinate exceeds the target, later merges cannot reduce
it. Therefore, only triplets bounded by `target` in all three coordinates can participate.

Among those safe triplets, the target is reachable exactly when some safe triplet supplies each
target coordinate. The three coordinates may come from different triplets.

## Approach

1. Initialize one `good` flag for each target coordinate.
2. Skip any triplet with a coordinate larger than the corresponding target coordinate.
3. For each safe triplet, mark every coordinate that equals the target at that position.
4. Return `all(good)` after the scan.

## Code

```python
class Solution:
    def mergeTriplets(self, triplets: List[List[int]], target: List[int]) -> bool:
        good = [False, False, False]

        for t in triplets:
            if t[0] > target[0] or t[1] > target[1] or t[2] > target[2]:
                continue
            for j in range(3):
                if t[j] == target[j]:
                    good[j] = True

        return all(good)
```

## Why it works

Any merge producing `target` can contain only safe triplets, because an oversized coordinate would
remain oversized under every later maximum. This proves the filter is necessary. If every flag is
set, merge one safe triplet supplying each coordinate; no coordinate exceeds the target, and each
coordinate reaches its target value, so the result is exactly `target`. This proves sufficiency.
Therefore the three flags characterize reachability.

**Complexity**

- **Time:** `O(n)` because each triplet has three fixed coordinates.
- **Space:** `O(1)` auxiliary space.
