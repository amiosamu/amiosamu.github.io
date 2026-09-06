---
# K Closest Points to Origin · Medium · Heap / Priority Queue
# https://leetcode.com/problems/k-closest-points-to-origin/
draft: false
pattern: "Size-k max-heap of distances"
time: "O(n log k)"
space: "O(k)"
---

## Intuition

Sorting all n points by distance gives the answer in O(n log n), but it computes far more than I asked for — a full ordering of the far-away points I am about to throw away. The only fact I need while scanning is "is this point closer than the worst of the k I am currently holding?", and that is one comparison against the maximum of a k-sized set. So I keep a **max-heap of size k**: the farthest of my current best k sits at the root, and each new point either evicts it or is evicted itself. `heapq` is a min-heap, so I store the squared distance negated.

## Approach

1. Keep `heap`, a list of tuples `(-(x*x + y*y), x, y)`. The negation makes `heap[0]` the *farthest* point currently held.
2. For each `x, y` in `points`: `heappush` the tuple, then if `len(heap) > k`, `heappop` once. The pop removes the largest negated-distance, i.e. the farthest point, so the heap never exceeds k and always holds the k closest seen so far.
3. Never take a square root — comparing `x² + y²` orders points exactly the same way as comparing `√(x² + y²)`, and stays in integers.
4. Ties in the tuple fall through to `x` then `y`. That is harmless here: any k points at the tied distance form a valid answer, the comparison just needs to be total so Python never tries to order two lists.
5. After the scan the heap *is* the answer set (in no particular order, which the problem allows). Return `[[x, y] for _, x, y in heap]`.

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

The invariant is that after processing each point the heap holds exactly the k closest points among those seen (or all of them, while fewer than k have been seen). It survives a step because the element discarded is the farthest of the k+1 candidates, and a point that is not in the top k of a prefix can never be in the top k of the whole set. Each point costs one push plus at most one pop on a heap capped at k, so O(n log k) time and O(k) space — strictly better than sorting when k is small.

