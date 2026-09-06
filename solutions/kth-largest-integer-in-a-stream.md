---
# Kth Largest Element In a Stream · Easy · Heap / Priority Queue
# https://leetcode.com/problems/kth-largest-element-in-a-stream/
draft: false
pattern: "Size-k min-heap over a stream"
time: "O(n log k) to build, O(log k) per add"
space: "O(k)"
---

## Description

Design a class that, given an integer `k` and an initial array `nums`, tracks the kth largest element as new values are added one at a time via `add(val)`.

**Example**

```
Input: ["KthLargest", "add", "add", "add", "add", "add"], [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
Output: [null, 4, 5, 5, 8, 8]
```

Explanation: with `k = 3` over `[4, 5, 8, 2]`, the 3rd largest is `4`; adding `3` keeps it `4`; adding `5` makes the top three `{5, 5, 8}` so the answer is `5`, and it stays `5` and then `8` as larger values arrive.

## Intuition

Sorting is off the table because the numbers keep arriving — I would be re-sorting on every `add`. But I never need the whole ordering: the kth largest so far depends only on the k largest values seen, and everything below them is dead weight forever. So I keep exactly those k in a **min-heap**, which puts the *smallest* of the k largest — the answer — at `heap[0]`. Each new value either kicks out that smallest one or is itself immediately discarded.

## Approach

1. Store `self.k` and copy `nums` into `self.heap`, then `heapq.heapify` it (O(n), cheaper than n pushes).
2. Pop from `self.heap` while its length exceeds `k`. Each pop removes the current minimum, so what survives is the k largest of `nums`.
3. `add(val)`: `heappush(self.heap, val)`, then if the size is now `k + 1`, `heappop` once.
4. Return `self.heap[0]` — the root of a min-heap holding the top k is the kth largest.
5. Edge case: the constructor may get fewer than `k` numbers, so the heap can start undersized. That is fine — the problem guarantees `add` is only queried once at least k elements exist, and after the first few adds the heap fills to `k`.

## Code

```python
import heapq

class KthLargest:

    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.heap = list(nums)
        heapq.heapify(self.heap)
        while len(self.heap) > k:
            heapq.heappop(self.heap)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]
```

## Why it works

The invariant is that after every operation the heap contains exactly the k largest values seen so far (or all of them, if fewer than k have arrived). Pushing then popping the minimum preserves it: the discarded element is the smallest of the k+1 candidates, so it cannot be in the top k of anything that follows either. Given that invariant, the min of the heap is by definition the kth largest, read in O(1); each add costs one push and one pop on a heap of size k, so O(log k).
