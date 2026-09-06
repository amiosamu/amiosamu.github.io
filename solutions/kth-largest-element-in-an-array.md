---
# Kth Largest Element In An Array · Medium · Heap / Priority Queue
# https://leetcode.com/problems/kth-largest-element-in-an-array/
draft: false
pattern: "Size-k min-heap of the top k"
time: "O(n log k)"
space: "O(k)"
---

## Intuition

Sorting works and is one line, but it pays O(n log n) to order the whole array when the question only concerns the boundary between the top k and everything else. Anything already smaller than k values seen so far is dead — it can never become the kth largest. So I carry only k candidates in a **min-heap**, where the root is the smallest of them, i.e. the current kth largest; a new number is worth keeping precisely when it beats that root.

## Approach

1. Seed `heap = nums[:k]` and `heapq.heapify` it — O(k), and cheaper than k separate pushes.
2. Walk the rest, `nums[k:]`. Compare each `num` against `heap[0]`, the weakest candidate held.
3. If `num > heap[0]`, call `heapq.heapreplace(heap, num)`: it pops the root and pushes in one sift, keeping the size pinned at exactly k.
4. If `num <= heap[0]`, drop it — there are already k values at least as large, so it is out of contention forever.
5. Return `heap[0]`. With exactly k elements in the heap, the minimum of them is the kth largest overall.
6. Note the problem ranks duplicates separately (`[3,2,3,1,2,4,5,5,6]`, k=4 gives 4), and this handles that for free since nothing is deduplicated.

## Code

```python
import heapq

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = nums[:k]
        heapq.heapify(heap)

        for num in nums[k:]:
            if num > heap[0]:
                heapq.heapreplace(heap, num)

        return heap[0]
```

## Why it works

The invariant after every step is that the heap contains the k largest values of the prefix processed so far, so the loop finishes holding the k largest of the whole array, whose minimum is by definition the kth largest. Replacing only when `num > heap[0]` is safe because a value not among the top k of a prefix cannot be among the top k of a superset that already contains those k. Cost is O(k) to heapify plus at most one O(log k) replace per remaining element, giving O(n log k) time in O(k) space; quickselect averages O(n) but is far more code and degrades in the worst case.
