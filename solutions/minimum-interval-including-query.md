---
# Minimum Interval to Include Each Query · Hard · Intervals
# https://leetcode.com/problems/minimum-interval-to-include-each-query/
draft: false
pattern: "Offline queries with min-heap by interval size"
time: "O(n log n + m log m)"
space: "O(n + m)"
---

## Description

Given a list `intervals` where `intervals[i] = [lefti, righti]` and an array `queries`, for each
`queries[j]` find the size of the smallest interval that contains it (`righti - lefti + 1`), or
`-1` if no interval contains it. Return an array of answers, one per query, in the original query
order.

**Example**

```
Input: intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]
Output: [3,3,1,4]
```

Explanation: Query `2` is contained only by `[1,4]` and `[2,4]`, and the smaller has size 3; query
`4` is contained by all four intervals, and `[4,4]` is smallest with size 1; query `5` is contained
only by `[3,6]`, size 4.

## Intuition

Answering each query independently is O(n) per query and too slow. The trick is to answer the
queries *offline*, in increasing order: as the query point moves right, intervals become eligible
once their left endpoint is passed and become permanently dead once their right endpoint is passed.
So I stream intervals into a heap keyed by size, and the smallest live entry on top is the answer.
Dead entries only ever sit on top once — the moment I see one I pop it forever — which is what keeps
the whole sweep near-linear in heap operations.

## Approach

1. Sort `intervals` by left endpoint (plain `intervals.sort()` does it).
2. Keep a min-heap `heap` of `(size, right)` where `size = r - l + 1`, an index `i` into
   `intervals`, and a dict `res` mapping a query value to its answer.
3. Iterate over `sorted(queries)` as `q`.
4. Admit: while `i < len(intervals)` and `intervals[i][0] <= q`, push `(r - l + 1, r)` and advance
   `i`. Every interval is pushed at most once across the whole loop because `i` never rewinds.
5. Evict: while `heap` is non-empty and `heap[0][1] < q`, pop. The top interval is the smallest live
   candidate, but if its right endpoint is behind `q` it can never contain this or any later query,
   so discarding it is permanent and safe.
6. Record `res[q] = heap[0][0] if heap else -1`.
7. Return `[res[q] for q in queries]` to restore the original query order; the dict also collapses
   duplicate query values so they are only computed once.

## Code

```python
import heapq

class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        intervals.sort()

        heap = []  # (size, right)
        res = {}
        i = 0

        for q in sorted(queries):
            while i < len(intervals) and intervals[i][0] <= q:
                l, r = intervals[i]
                heapq.heappush(heap, (r - l + 1, r))
                i += 1

            while heap and heap[0][1] < q:
                heapq.heappop(heap)

            res[q] = heap[0][0] if heap else -1

        return [res[q] for q in queries]
```

## Why it works

At the moment `q` is answered, the heap holds exactly the intervals with `left <= q`, minus some
that were already proven dead — and the eviction loop guarantees the top has `right >= q`, so the
top is a genuine containing interval and, being the heap minimum, the smallest one. Nothing valid is
ever lost: an entry is only popped when `right < q`, and since queries are processed in increasing
order that interval cannot contain any remaining query either. Sorting costs O(n log n + m log m),
and each interval is pushed and popped at most once for O(n log n) of heap work, with the heap and
the answer dict accounting for the O(n + m) space.
