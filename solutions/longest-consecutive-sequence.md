---
# Longest Consecutive Sequence · Medium · Arrays & Hashing
# https://leetcode.com/problems/longest-consecutive-sequence/
draft: false
pattern: "Hash set, count only from run starts"
time: "O(n)"
space: "O(n)"
---

## Description

Given an unsorted array of integers `nums`, return the length of the longest run of
consecutive integers that all appear somewhere in the array (their positions in `nums`
need not be adjacent), computed in `O(n)` time.

**Example**

```
Input: nums = [100,4,200,1,3,2]
Output: 4
```

Explanation: The values `1, 2, 3, 4` are all present in the array and form a run of
consecutive integers of length 4; `100` and `200` are each isolated, so 4 is the longest
run.

## Intuition

Sorting solves this but costs O(n log n), and the problem asks for linear. Put every number in a set and membership becomes O(1), so a run can be walked forward one `+1` at a time. The catch is that walking forward from *every* number re-walks the same run over and over. The fix: `n` is the start of a run only if `n - 1` is absent from the set. Counting only from those starts means each number is stepped over exactly once across the whole algorithm, since each belongs to exactly one run.

## Approach

1. Build `numSet = set(nums)`; this also collapses duplicates, which would otherwise inflate a run.
2. Set `res = 0` and iterate over `numSet`, not `nums` — iterating the set keeps the work bounded by the number of distinct values.
3. For each `n`, skip it unless `n - 1 not in numSet`. That check is the whole optimisation: it fires only for the leftmost element of a run.
4. From a run start, set `length = 1` and while `n + length in numSet` increment `length`.
5. Fold the run into the answer with `res = max(res, length)`.
6. Return `res`. An empty input gives `0` because the loop body never runs.

## Code

```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        numSet = set(nums)
        res = 0
        for n in numSet:
            if n - 1 not in numSet:
                length = 1
                while n + length in numSet:
                    length += 1
                res = max(res, length)
        return res
```

## Why it works

Every consecutive run has exactly one element with no predecessor in the set, so every run is discovered exactly once and measured to its full length — no run is missed and none is double-counted. The inner `while` only advances over members of the run it started, so across the entire outer loop the inner loop performs at most one step per distinct value: the total is O(n) set lookups, not O(n²), even though the code has nested loops. The set itself is the only extra storage, O(n).
