---
# Longest Consecutive Sequence · Medium · Arrays & Hashing
# https://leetcode.com/problems/longest-consecutive-sequence/
draft: false
pattern: "Hash set, count only from run starts"
time: "O(n)"
space: "O(n)"
---

## Description

Given an unsorted integer array, return the length of the longest set of consecutive values.
Their positions in the input need not be adjacent, and the algorithm must run in `O(n)` time.

**Example**

```
Input: nums = [100,4,200,1,3,2]
Output: 4
```

The values `1, 2, 3, 4` form the longest consecutive run, with length `4`.

## Intuition

A hash set provides average constant-time membership checks and removes duplicates. Walking forward
from every value would repeatedly scan the same run, so only begin when the predecessor is absent.
Each consecutive run then has exactly one starting point and is measured once.

## Approach

1. Build `numSet` from `nums`, collapsing duplicate values without mutating the input.
2. Iterate over each distinct value and skip it when its predecessor is present.
3. From a true start, increment `length` while the next consecutive value belongs to the set.
4. Update `res` with the completed run's length.
5. Return `res`; an empty input leaves it at zero.

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

Every maximal consecutive run has one smallest value, characterized by the absence of its
predecessor. The algorithm starts exactly at those values and advances until the first missing
successor, so it measures every maximal run completely and only once. Taking the maximum of those
lengths therefore returns the longest run. Although the loops are nested, their forward scans
cover disjoint runs, so each distinct value participates in at most one such scan.

**Complexity**

- **Time:** `O(n)` expected time with hash-set operations.
- **Space:** `O(n)` for the set.
