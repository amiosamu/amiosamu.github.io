---
# Last Stone Weight · Easy · Heap / Priority Queue
# https://leetcode.com/problems/last-stone-weight/
draft: false
pattern: "Max-heap by negation"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given an array of stone weights, repeatedly smash the two heaviest stones together: if they are equal both are destroyed, otherwise the lighter is destroyed and the heavier becomes the difference of the two. Return the weight of the last remaining stone, or 0 if none remain.

**Example**

```
Input: stones = [2,7,4,1,8,1]
Output: 1
```

Explanation: `8` and `7` smash to `1`; then `4` and `2` smash to `2`; then `2` and `1` smash to `1`; then `1` and `1` smash to `0`; the one stone left weighs `1`.

## Intuition

Sorting once is useless here: after smashing the two heaviest stones the *remainder* has to be re-inserted in the right place, so the multiset changes shape on every step. What I actually need each round is only the two largest elements and the ability to put a new one back cheaply — that is exactly a max-heap. Python's `heapq` is a min-heap, so I push every stone negated and negate again on the way out.

## Approach

1. Build `heap = [-s for s in stones]` and `heapq.heapify(heap)`. Negation turns "largest weight" into "smallest key", so `heap[0]` is the heaviest stone.
2. While `len(heap) > 1`, pop twice and negate back into `first` and `second`. Because it is a heap of negatives, `first >= second` automatically.
3. If `first != second`, push `-(first - second)` — the surviving fragment, negated again.
4. If they are equal, both stones are destroyed and nothing is pushed.
5. After the loop the heap has one stone or none. Return `-heap[0]` if it is non-empty, else `0`.

## Code

```python
import heapq

class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        heap = [-s for s in stones]
        heapq.heapify(heap)

        while len(heap) > 1:
            first = -heapq.heappop(heap)
            second = -heapq.heappop(heap)
            if first != second:
                heapq.heappush(heap, -(first - second))

        return -heap[0] if heap else 0
```

## Why it works

The process is fully determined — there is no choice to make, the two heaviest stones always collide — so simulating it faithfully is the whole solution; the only question is doing each round fast. Every round removes at least one stone, so there are at most n rounds, each doing O(1) heap operations on a structure of size at most n, giving O(n log n). Negation is a valid order-reversing bijection, so a min-heap of negatives behaves as a max-heap of the originals.
