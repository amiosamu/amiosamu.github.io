---
# Kth Largest Element In a Stream · Easy · Heap / Priority Queue
# https://leetcode.com/problems/kth-largest-element-in-a-stream/
draft: false
pattern: "Size-k min-heap over a stream"
time: "O(n log k) to build, O(log k) per add"
space: "O(k)"
---

## Description

Design a class that tracks the `k`th largest value in an integer stream. It receives initial
values in `nums`, and `add(val)` inserts a value and returns the current `k`th largest.

**Example**

```
Input: ["KthLargest", "add", "add", "add", "add", "add"], [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
Output: [null, 4, 5, 5, 8, 8]
```

With `k = 3`, the heap retains the three largest values seen after every call, producing the
returned sequence `4, 5, 5, 8, 8`.

## Intuition

Only the largest `k` values seen so far can affect the answer. A min-heap capped at `k` entries
stores exactly those candidates, with the current `k`th largest at its root. Each insertion pushes
the new value and removes the smallest value if the heap becomes too large.

## Approach

1. Copy at most the first `k` values into the heap and build it with `heapify`.
2. For each remaining value, replace the root only when that value is larger. This keeps the heap
   capped at `k` without storing values that cannot affect the answer.
3. In `add`, push `val`, remove the minimum if the heap grows past `k`, then return the root.
4. The constructor may finish with fewer than `k` entries. The API guarantees enough total values
   exist whenever `add` must return the `k`th largest.

## Code

```python
import heapq

class KthLargest:

    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.heap = nums[:k]
        heapq.heapify(self.heap)
        for num in nums[k:]:
            if num > self.heap[0]:
                heapq.heapreplace(self.heap, num)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]
```

## Why it works

After each processed value, the heap contains the largest `k` values seen, or every value if fewer
than `k` exist. Pushing includes the only new candidate; when the size is `k + 1`, popping the
minimum removes exactly the value outside the largest `k`. The invariant follows by induction.
Once at least `k` values exist, the heap minimum is therefore the `k`th largest.

**Complexity**

- **Time:** `O(n log k)` in the worst case to initialize and `O(log k)` per `add`. The initial
  `heapify` is `O(min(n, k))`, so construction is `O(n)` when `k >= n`.
- **Space:** `O(k)` for the heap.
