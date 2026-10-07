---
# Find Median From Data Stream · Hard · Heap / Priority Queue
# https://leetcode.com/problems/find-median-from-data-stream/
draft: false
pattern: "Two heaps balanced at the median"
time: "O(log n) per add, O(1) per find"
space: "O(n)"
---

## Description

Design a data structure that adds stream values and returns the median of all values seen
so far.

**Example**

```
Input:
operations = ["MedianFinder", "addNum", "addNum", "findMedian", "addNum",
              "findMedian"]
arguments = [[], [1], [2], [], [3], []]
Output: [null, null, null, 1.5, null, 2.0]
```

Values 1 and 2 have median 1.5. After adding 3, the middle value is 2.

## Intuition

The median depends only on the boundary between the lower and upper halves. Store the lower
half in `small`, a max-heap represented by negated values, and the upper half in `large`,
a min-heap. Keep all lower values no greater than all upper values, with `small` holding
either the same number of values or one extra.

## Approach

1. Store negated lower-half values in `small` and upper-half values in `large`.
2. On insertion, push into `small`, then move its maximum to `large`. This restores the
   ordering between the two halves regardless of the new value.
3. If `large` is now larger, move its minimum back to `small`, restoring the size rule.
4. For an odd count, return `-small[0]`. For an even count, average `-small[0]` and
   `large[0]` with `/`. The problem calls `findMedian` only after at least one insertion.

## Code

```python
import heapq

class MedianFinder:

    def __init__(self):
        self.small = []  # max-heap (negated) of the lower half
        self.large = []  # min-heap of the upper half

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```

## Why it works

After moving `small`'s maximum to `large`, every remaining lower value is no greater than
that moved value, and the moved value is no greater than every prior upper value. Ordering
is restored. Moving `large`'s minimum back when necessary preserves ordering and makes the
heap sizes differ by at most one, with `small` favored. Therefore `small` contains the
smallest `ceil(n / 2)` values: its root is the median for odd `n`, and the two roots are
the middle pair for even `n`.

**Complexity**

- **Time:** `O(log n)` per `addNum` and `O(1)` per `findMedian`; initialization is `O(1)`.
- **Space:** `O(n)` for both heaps across `n` inserted values.
