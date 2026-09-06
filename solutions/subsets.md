---
# Subsets · Medium · Backtracking
# https://leetcode.com/problems/subsets/
draft: false
pattern: "Start-index subset backtracking"
time: "O(n * 2^n)"
space: "O(n)"
---

## Intuition

The naive framing is "for each element, take it or leave it", which gives a binary tree of depth n. I prefer the equivalent framing that generalizes to every other subset problem in this group: at each node I choose *which element to append next*, and I may only pick from indices at or after `start`. That single restriction is what makes `[1,2]` and `[2,1]` the same subset — order is fixed to be increasing by index, so each subset is generated exactly once. Every node of that tree is itself a valid subset, so the answer is recorded on entry rather than at a leaf.

## Approach

1. The decision at each node is which index `i >= start` to append next; the loop over `i` enumerates the sibling choices.
2. `path` holds the elements chosen so far, in index order. `res` collects finished subsets.
3. Base case: there isn't one in the usual sense — every node is an answer. Append `path[:]` at the *top* of `dfs`, before the loop. The recursion ends naturally when `start == len(nums)` and the loop body never runs.
4. Append `path[:]`, a copy, not `path` itself: `path` is a single mutable list reused by the entire traversal, so storing the reference would leave `res` full of aliases that all end up empty.
5. For each `i` in `range(start, len(nums))`: append `nums[i]`, recurse with `dfs(i + 1)`, then `path.pop()` to undo the choice before trying the next sibling. The pop is what restores the invariant "`path` describes the current node" for the next iteration.
6. Duplicates are avoided by the start index alone, not by a used-set and not by sorting: passing `i + 1` forbids re-picking `nums[i]` or anything before it, so each subset is built in exactly one order. The problem guarantees `nums` are unique, so no equal-sibling skip is needed (that's Subsets II).
7. No pruning: every branch leads to distinct valid answers, so there is nothing to cut.

## Code

```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res, path = [], []

        def dfs(start: int) -> None:
            res.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                dfs(i + 1)
                path.pop()

        dfs(0)
        return res
```

## Why it works

Every subset has exactly one increasing-index ordering, and the traversal builds exactly the increasing-index sequences: the node reached by choices `i1 < i2 < ... < ik` is the subset `{nums[i1], ..., nums[ik]}`, and no other node produces it. So the map from nodes to subsets is a bijection — completeness and no-duplicates fall out of the same argument. There are 2^n nodes and each copies a list of length up to n, hence O(n * 2^n) time; the auxiliary space is the depth-n stack plus `path`, since the output is required.
