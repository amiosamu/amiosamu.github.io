---
# Minimum Interval to Include Each Query · Hard · Intervals
# https://leetcode.com/problems/minimum-interval-to-include-each-query/
draft: false
pattern: "Offline queries with min-heap by interval size"
time: "O(n log n + m log m)"
space: "O(n + m)"
---

## Description

For each value in `queries`, return the length of the shortest inclusive interval `[left, right]`
that contains it. Use `-1` when no interval contains the query, and preserve query order.

**Example**

```
Input: intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]
Output: [3,3,1,4]
```

Explanation: The shortest containing intervals have lengths `3`, `3`, `1`, and `4`.

## Intuition

Process queries from left to right rather than independently. When the current query is `q`, every
interval with `left <= q` can enter consideration. Among those intervals, any with `right < q` is
expired and can never answer a later query.

A min-heap ordered by interval length exposes the shortest candidate. Expired intervals only need
to be removed when they reach the heap top, because a longer expired entry cannot affect the answer.

## Approach

1. Sort `intervals` in place by left endpoint and process a sorted copy of `queries`.
2. For each query `q`, push every newly eligible interval as `(length, right)` into a min-heap.
3. Pop heap entries from the top while their right endpoint is smaller than `q`.
4. Record the top length, or `-1` if the heap is empty, in `res[q]`.
5. Build the output in the original query order. Repeated query values reuse the same result.

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

Before answering `q`, all intervals with `left <= q` have been inserted. Any interval omitted from
the heap was popped at an earlier or current query after its `right` became too small, so it cannot
contain `q` or any later query. After expired top entries are removed, the heap top both starts no
later than `q` and ends no earlier than `q`; it therefore contains `q`. Since the heap is ordered by
length, no inserted containing interval is shorter. Thus every recorded answer is correct.

**Complexity**

- **Time:** `O(n log n + m log m)` for sorting and at most one heap push and pop per interval.
- **Space:** `O(n + m)` auxiliary space for the heap, sorted queries, and result map, plus `O(m)`
  for the returned list. The input `intervals` is reordered in place.
