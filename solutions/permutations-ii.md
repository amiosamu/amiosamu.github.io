---
# Permutations II · Medium · Backtracking
# https://leetcode.com/problems/permutations-ii/
draft: false
pattern: "Sort plus used-flag sibling skip"
time: "O(n * n!)"
space: "O(n)"
---

## Intuition

With repeats in `nums`, the `used` array still stops a position being consumed twice, but it no longer stops the *same permutation* being produced twice: swapping which of two equal 1s goes first yields an identical output list. The rule that kills it is the same "skip equal siblings" idea as Subsets II, adapted to the fact that permutations have no start index. Sort `nums`, then among equal values force them to be consumed left to right: a value may be placed only if its identical left neighbour has already been placed. That elects one canonical index ordering per duplicate group and discards the rest.

## Approach

1. Sort `nums` so equal values are adjacent — the skip test compares `nums[i]` with `nums[i - 1]` and is meaningless otherwise.
2. The decision at each node is which index to place next; `path` holds the values placed so far in output order; `used[i]` marks index `i` as consumed; `res` collects finished permutations.
3. Base case: `len(path) == len(nums)` — append `path[:]` and return.
4. First filter, same as Permutations: `if used[i]: continue`, so no position is reused.
5. Duplicate rule: `if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]: continue`. Read it as "I am about to place the second of two equal values while the first is still unplaced" — that is the non-canonical branch, so skip it. The `not used[i - 1]` clause is what confines the skip to sibling choices at this node; when the left twin *is* in `path`, placing this one is exactly how a permutation gets both copies.
6. Using `used[i - 1]` (instead of `not used[i - 1]`) also deduplicates but prunes far later in the tree; the `not` version cuts the branch at the top and is the one to remember.
7. Choose `used[i] = True` and `path.append(nums[i])`, recurse with `dfs()`, then undo in reverse: `path.pop()`, `used[i] = False`.
8. Append `path[:]`, a copy — `path` is mutated in place throughout, so a stored reference would alias every recorded answer.

## Code

```python
class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res, path = [], []
        used = [False] * len(nums)

        def dfs() -> None:
            if len(path) == len(nums):
                res.append(path[:])
                return
            for i in range(len(nums)):
                if used[i]:
                    continue
                if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                    continue
                used[i] = True
                path.append(nums[i])
                dfs()
                path.pop()
                used[i] = False

        dfs()
        return res
```

## Why it works

Among all index orderings that spell the same output sequence, exactly one consumes every run of equal values in increasing index order, and the skip admits precisely that one: a duplicate is blocked only while its left twin is still free, so the canonical ordering is never cut and every non-canonical one is. Completeness therefore holds alongside uniqueness, and the `used` array still guarantees each position is placed once. The bound stays O(n * n!) since that is the size of the unpruned tree — the skip only makes the real work proportional to the number of *distinct* permutations, which is smaller whenever repeats exist.
