---
# Subsets II · Medium · Backtracking
# https://leetcode.com/problems/subsets-ii/
draft: false
pattern: "Sort then skip equal siblings"
time: "O(n * 2^n)"
space: "O(n)"
---

## Description

Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set), without any duplicate subset appearing twice.

**Example**

```
Input: nums = [1,2,2]
Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
```

Explanation: Although `nums` has two 2s, `[2]` and `[1,2]` each appear only once in the output even though there are two ways to pick a single 2 or to pair it with the 1.

## Intuition

Subsets with a start index already guarantees each *index set* appears once; what breaks here is that two different index sets can spell the same *value* multiset — with `[1,2,2]`, picking index 1 and picking index 2 both give `[1,2]`. Deduplicating at the end with a set of tuples works but is wasteful. The fix is structural: sort `nums` so equal values are adjacent, then at any single node allow a given value to be chosen only from its **first** occurrence among the remaining candidates. Two copies of a value can still both end up in `path` — they just have to be picked at consecutive depths, not as alternative siblings.

## Approach

1. Sort `nums` first. Everything below depends on equal values being adjacent.
2. The decision at each node is which index `i >= start` to append next; `path` holds the values chosen so far, in index order; `res` collects the subsets.
3. Base case: every node is an answer. Append `path[:]` at the top of `dfs`, before the loop, exactly as in Subsets.
4. Duplicate rule: inside the loop, `if i > start and nums[i] == nums[i - 1]: continue`. The `i > start` guard is the whole trick — it skips a value only when an equal value was already tried *as a sibling at this same node*, while still allowing `nums[start]` itself, which is how a subset gets two copies of the same value.
5. Getting that guard wrong is the classic bug: `i > 0` instead of `i > start` would forbid `[2,2]` entirely, since the second 2 would be skipped even when the first 2 sits in `path`.
6. Otherwise the body is standard: `path.append(nums[i])`, `dfs(i + 1)`, `path.pop()` — undo the choice before the next sibling so `path` always describes the current node.
7. Append `path[:]`, a copy: `path` is one list mutated in place for the entire traversal, so a stored reference would end up empty.
8. No pruning beyond the duplicate skip — every surviving branch produces distinct answers.

## Code

```python
class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res, path = [], []

        def dfs(start: int) -> None:
            res.append(path[:])
            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i - 1]:
                    continue
                path.append(nums[i])
                dfs(i + 1)
                path.pop()

        dfs(0)
        return res
```

## Why it works

After sorting, every distinct multiset has a unique canonical index set: the earliest indices that spell it. The skip removes exactly the non-canonical choices — a sibling equal to one already tried leads to a subtree identical to that sibling's — so each multiset is emitted once and none is lost, because the canonical representative is always the first occurrence and is never skipped. The node count is at most 2^n and each records a copy of length up to n, giving O(n * 2^n) time; the sort is O(n log n) and disappears into that, and the auxiliary space is `path` plus the depth-n stack.
