---
# Last Stone Weight · Easy · Heap / Priority Queue
# https://leetcode.com/problems/last-stone-weight/
draft: false
pattern: "Max-heap by negation"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given stone weights, repeatedly smash the two heaviest stones. Equal stones both disappear;
otherwise the heavier becomes the difference of the two. Return the final weight, or `0` if
no stone remains.

**Example**

```
Input: stones = [2,7,4,1,8,1]
Output: 1
```

The successive heaviest pairs produce remainders `1`, `2`, and `1`; two of the remaining
unit stones disappear, leaving one stone of weight `1`.

## Intuition

Each round needs the two current maximum weights, and a remainder may need to be inserted for later
rounds. A max-heap supports both operations efficiently. Python provides a min-heap, so negating
weights reverses their order. The code builds a new heap and does not mutate `stones`.

## Approach

1. Negate every weight and heapify the resulting list, making the heaviest stone the heap root.
2. While at least two stones remain, pop and restore the two largest weights.
3. If they differ, push their negated difference; if equal, push nothing.
4. Continue until at most one stone remains.
5. Return the restored final weight, or zero for an empty heap.

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

Negation preserves every weight while reversing order, so each pair of heap pops returns exactly
the two heaviest current stones. Equal values are both removed; unequal values are replaced by
their required difference. Thus one loop iteration reproduces one prescribed smash and leaves the
heap representing precisely the remaining stones. Induction over the rounds proves the final
returned weight is correct.

**Complexity**

- **Time:** `O(n log n)` in the worst case.
- **Space:** `O(n)` for the copied heap.
