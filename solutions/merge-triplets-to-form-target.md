---
# Merge Triplets to Form Target Triplet · Medium · Greedy
# https://leetcode.com/problems/merge-triplets-to-form-target-triplet/
draft: false
pattern: "Discard triplets that overshoot target"
time: "O(n)"
space: "O(1)"
---

## Description

Given a 2D array `triplets` of integer triplets and a triplet `target`, determine whether `target`
can be formed by repeatedly picking two triplets already obtained (starting from the given ones)
and replacing them with their elementwise maximum. Return whether some sequence of such merges
produces exactly `target`.

**Example**

```
Input: triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]
Output: true
```

Explanation: Merging `triplets[0] = [2,5,3]` with `triplets[2] = [1,7,5]` gives
`[max(2,1), max(5,7), max(3,5)] = [2,7,5]`, which equals `target`.

## Intuition

Merging takes an elementwise max, which is monotonic — once a coordinate exceeds the target it
can never be brought back down by further merges. So any triplet with even one coordinate
greater than the corresponding target coordinate is useless; keeping it around only risks
ruining that coordinate later. Among the triplets that don't overshoot anywhere ("usable"
triplets), merging all of them together just takes, at each of the three positions, the max
across that usable set — so the target is reachable exactly when each of its three coordinates
is hit exactly by at least one usable triplet.

## Approach

1. Track three flags `good = [False, False, False]`, one per coordinate of `target`.
2. For each triplet `t` in `triplets`: if `t[0] > target[0] or t[1] > target[1] or t[2] > target[2]`,
   skip it — using it in any merge would push that coordinate past the target permanently.
3. Otherwise, for `j` in `0, 1, 2`: if `t[j] == target[j]`, set `good[j] = True`.
4. Return `all(good)` — true only when every coordinate has been matched by some usable triplet.

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

Because merge is an elementwise max, any chain of merges that ends up equal to `target` can only
ever have combined triplets that were already `<=` target on every coordinate — an overshooting
triplet would make the merged result overshoot too, which is irreversible. Restricted to that
safe subset, merging all of them together produces exactly the coordinatewise max of the safe
set, so the target triplet is achievable if and only if each of its three coordinates equals the
corresponding coordinate of some safe triplet — which is precisely what the three flags check,
independent of which triplets supply which coordinate. One pass over the input and three fixed
flags give O(n) time and O(1) extra space.
