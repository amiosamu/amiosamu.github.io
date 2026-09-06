---
# Non Overlapping Intervals · Medium · Intervals
# https://leetcode.com/problems/non-overlapping-intervals/
draft: false
pattern: "Greedy activity selection by earliest end"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given a list `intervals` where `intervals[i] = [starti, endi]`, return the minimum number of
intervals that must be removed so that the remaining intervals are pairwise non-overlapping (two
intervals that only touch at an endpoint are not considered overlapping).

**Example**

```
Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
```

Explanation: `[1,3]` overlaps both `[1,2]` and `[2,3]`; removing `[1,3]` leaves `[1,2],[2,3],[3,4]`,
which only touch at endpoints, so one removal suffices.

## Intuition

Removing the fewest intervals is the same problem as keeping the most, which is classic activity
selection. The insight is that when two intervals conflict, the one that ends later is never the
better keep: it blocks at least everything the earlier-ending one blocks, and possibly more. So I
sort by end time and greedily keep an interval whenever it starts at or after the end of the last
one I kept; everything else gets counted as a removal.

## Approach

1. Sort `intervals` by end time — `key=lambda interval: interval[1]`. Sorting by start is a
   different (also workable) variant; this one makes the greedy choice obvious.
2. Track `prevEnd`, the end of the last interval I decided to keep, seeded with `intervals[0][1]`.
   The constraints guarantee a non-empty list.
3. Track `removed`, the answer, starting at 0.
4. Walk the rest of the sorted list as `start, end`. If `start < prevEnd` the interval genuinely
   overlaps the one I kept, so increment `removed` and leave `prevEnd` alone — I am discarding this
   one, not the earlier-ending keeper.
5. Otherwise keep it: set `prevEnd = end`.
6. Use strict `<`, not `<=`: intervals like `[1,2]` and `[2,3]` merely touch at an endpoint and the
   problem does not count that as overlapping.
7. Return `removed`.

## Code

```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda interval: interval[1])

        removed = 0
        prevEnd = intervals[0][1]

        for start, end in intervals[1:]:
            if start < prevEnd:
                removed += 1
            else:
                prevEnd = end

        return removed
```

## Why it works

The exchange argument: take any optimal set of kept intervals and let `x` be its earliest-ending
member. The globally earliest-ending interval `g` ends no later than `x`, so swapping `x` for `g`
keeps the set disjoint and the same size — the greedy first pick is safe, and induction on the rest
of the timeline extends it to the whole answer. Keeping the maximum number is exactly minimising the
removals, so `removed` is optimal. The sort is O(n log n) and dominates the single O(n) scan; the
O(n) space is the sort's buffer.
