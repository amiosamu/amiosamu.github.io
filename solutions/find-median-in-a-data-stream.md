---
# Find Median From Data Stream · Hard · Heap / Priority Queue
# https://leetcode.com/problems/find-median-from-data-stream/
draft: false
pattern: "Two heaps balanced at the median"
time: "O(log n) per add, O(1) per find"
space: "O(n)"
---

## Intuition

Keeping the stream sorted would make `findMedian` free but `addNum` O(n) for the insertion shift; re-sorting per query is worse. The observation that kills both: the median never depends on the *order* inside each half, only on where the two halves meet. So I split the values into a lower half and an upper half of nearly equal size and keep each half in a heap oriented toward that boundary — `small` is a **max-heap** (negated, since `heapq` is a min-heap) whose root is the largest of the low values, `large` is a min-heap whose root is the smallest of the high values. The median is read straight off those two roots.

## Approach

1. State: `self.small`, a list of *negated* values forming a max-heap of the lower half; `self.large`, a plain min-heap of the upper half. Invariant: every value in `small` ≤ every value in `large`, and `len(small)` is `len(large)` or exactly one more.
2. `addNum(num)`: push `-num` onto `small`, then immediately pop `small`'s root and push its negation onto `large`. This two-step shuffle is what enforces the ordering invariant without any comparison — whatever the new number's rank, the largest of the low half is the one that moves up.
3. That push/pop can leave `large` one too big, so if `len(self.large) > len(self.small)`, pop `large`'s root and push its negation back into `small`. Sizes are now balanced with `small` favoured.
4. `findMedian`: if `len(small) > len(large)` the total count is odd and the median is the extra element, `-self.small[0]`.
5. Otherwise the count is even and the median is the average of the two middle values, `(-self.small[0] + self.large[0]) / 2`. Use `/`, not `//` — the answer is a float.
6. No branching on value comparisons anywhere; the always-push-then-rebalance shape is why this is short enough to write correctly under pressure.

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

The two invariants — `max(small) <= min(large)` and `len(small) - len(large) ∈ {0, 1}` — together say that `small` holds exactly the ⌈n/2⌉ smallest values, so `-small[0]` is the ⌈n/2⌉-th smallest and `large[0]` is the next one; that is the definition of the median in both the odd and the even case. The push-into-`small`-then-move-its-max-to-`large` step re-establishes the ordering invariant regardless of where the new value lands, and the single size check restores the balance one. Each `addNum` does at most three heap operations on structures of size O(n), so O(log n) per add and O(1) per query, with O(n) total storage.
