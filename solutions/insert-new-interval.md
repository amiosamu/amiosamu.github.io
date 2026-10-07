---
# Insert Interval · Medium · Intervals
# https://leetcode.com/problems/insert-interval/
draft: false
pattern: "Linear merge into sorted intervals"
time: "O(n)"
space: "O(1)"
---

## Description

Given sorted, non-overlapping `intervals`, insert `newInterval`, merge every overlap, and
return sorted non-overlapping intervals.

**Example**

```
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
```

Explanation: `[2,5]` overlaps `[1,3]`, producing `[1,5]`, but does not reach `[6,9]`.

## Intuition

Because the input is sorted and disjoint, its intervals form three contiguous groups relative
to the new interval: strictly before it, overlapping it, and strictly after it. The middle
group can be collapsed by expanding one pair of bounds during a left-to-right scan.

Touching closed intervals count as overlapping, so the disjoint comparisons must be strict.

## Approach

1. Track index `i`, output `res`, and running bounds `start, end` copied from
   `newInterval`; the input objects are not modified.
2. Append intervals ending before `start` and advance `i`. Strict `<` keeps touching
   intervals available for merging.
3. While an interval starts at or before `end`, expand the running bounds with `min` and
   `max`, then advance.
4. Append the merged interval once, followed by the untouched remaining intervals.
5. Empty input and insertion before or after every interval naturally skip the inapplicable
   loops.

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

Intervals emitted first end before the original `start`, so they cannot overlap the merged
result. Sortedness and disjointness make every overlapping interval part of one contiguous
block; expanding `end` while scanning includes the entire block. The first later interval
starts after the final `end`, and all subsequent intervals start even later, so they remain
disjoint. The output is therefore sorted, contains the same covered points plus the new
interval, and has no overlaps.

**Complexity**

- **Time:** `O(n)` because each input interval is processed once.
- **Space:** `O(1)` auxiliary space.
- **Output:** `O(n)` for the returned interval list.
