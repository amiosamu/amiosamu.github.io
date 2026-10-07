---
# K Closest Points to Origin · Medium · Heap / Priority Queue
# https://leetcode.com/problems/k-closest-points-to-origin/
draft: false
pattern: "Size-k max-heap of distances"
time: "O(n log k)"
space: "O(k)"
---

## Description

Given points in the two-dimensional plane and an integer `k`, return the `k` points closest
to the origin `(0, 0)` in any order.

**Example**

```
Input: points = [[1,3],[-2,2]], k = 1
Output: [[-2,2]]
```

The squared distances are `8` for `[-2,2]` and `10` for `[1,3]`, so `[-2,2]` is closer.

## Intuition

Only the best `k` points seen so far matter. A size-`k` max-heap exposes the farthest retained
point, allowing each new point to compete for a place without sorting the entire input. Python's
`heapq` is a min-heap, so negated squared distances make the farthest point the smallest tuple.

## Approach

1. Store each point as `(-(x * x + y * y), x, y)` in `heap`.
2. Push every point, then pop once whenever the heap grows beyond `k` entries.
3. Because the most negative distance is popped, each removal discards the farthest candidate.
4. Use squared distance; square roots would preserve the ordering but add unnecessary work.
5. Convert the remaining tuples back to points. Coordinate tie-breaking is harmless because any
   points at the same boundary distance are valid.

## Code

```python
import heapq

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        heap = []
        for x, y in points:
            heapq.heappush(heap, (-(x * x + y * y), x, y))
            if len(heap) > k:
                heapq.heappop(heap)

        return [[x, y] for _, x, y in heap]
```

## Why it works

After each input point, the heap contains the `k` closest processed points, or all processed points
if fewer than `k` exist. Pushing preserves all possible candidates. If removal is needed, the heap
root has the greatest squared distance, so removing it leaves exactly the closest `k`. Induction
over the input proves that the final heap is a valid answer.

**Complexity**

- **Time:** `O(n log k)` for `n` points.
- **Space:** `O(k)` auxiliary space, plus `O(k)` for the returned list.
