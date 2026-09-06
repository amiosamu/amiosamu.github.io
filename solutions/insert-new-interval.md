---
# Insert Interval · Medium · Intervals
# https://leetcode.com/problems/insert-interval/
draft: false
pattern: "Linear merge into sorted intervals"
time: "O(n)"
space: "O(1)"
---

## Description

Given a list `intervals` of non-overlapping intervals sorted by start time and a new interval
`newInterval`, insert `newInterval` into the list, merging it with any intervals it overlaps, and
return the resulting list of intervals still sorted by start time.

**Example**

```
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
```

Explanation: `newInterval = [2,5]` overlaps `[1,3]` (since `2 <= 3`), so they merge into `[1,5]`;
it does not reach `[6,9]` (since `5 < 6`), so that interval is left unchanged.

## Intuition

The input is already sorted and non-overlapping, so I never need to sort again. Relative to
`newInterval` the list splits into exactly three contiguous blocks: intervals that end strictly
before it starts, intervals that touch it, and intervals that start strictly after it ends. The
middle block is contiguous precisely because the input is sorted, so one left-to-right pass that
collapses that block into a single interval is enough.

## Approach

1. Keep `res` as the output list, an index `i` into `intervals`, and unpack `start, end = newInterval`
   as the running bounds of the merged interval.
2. Phase one — copy the intervals entirely to the left: while `i < n` and `intervals[i][1] < start`,
   append `intervals[i]` to `res` and advance `i`. Use strict `<` so an interval ending exactly at
   `start` is treated as touching, not disjoint.
3. Phase two — absorb every overlap: while `i < n` and `intervals[i][0] <= end`, set
   `start = min(start, intervals[i][0])` and `end = max(end, intervals[i][1])`, then advance `i`.
   The `<=` matters: `[1,3]` and `[3,5]` merge into `[1,5]`.
4. Append `[start, end]` once, after the loop, not inside it.
5. Phase three — copy the remaining tail unchanged.
6. Edge cases fall out for free: an empty `intervals` skips both loops and returns just
   `[newInterval]`; a `newInterval` before everything skips phase two; one after everything skips
   phase three.

## Code

```python
class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        res = []
        n = len(intervals)
        i = 0
        start, end = newInterval

        while i < n and intervals[i][1] < start:
            res.append(intervals[i])
            i += 1

        while i < n and intervals[i][0] <= end:
            start = min(start, intervals[i][0])
            end = max(end, intervals[i][1])
            i += 1
        res.append([start, end])

        while i < n:
            res.append(intervals[i])
            i += 1

        return res
```

## Why it works

Sortedness guarantees the intervals overlapping `newInterval` form one unbroken run: if
`intervals[j]` overlaps and `intervals[k]` overlaps with `j < k`, everything between them starts
after `intervals[j]` starts and ends before `intervals[k]` ends, so it is squeezed inside the union
too. Phase two therefore only has to widen `start`/`end` until the first interval that starts past
`end`, and the widened bounds can never reach back into the block phase one already emitted, because
those all ended before the original `start`. Each interval is examined by exactly one of the three
loops, so the pass is O(n) with O(1) extra space beyond the output.
