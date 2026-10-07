---
# Kth Largest Element In An Array · Medium · Heap / Priority Queue
# https://leetcode.com/problems/kth-largest-element-in-an-array/
draft: false
pattern: "Size-k min-heap of the top k"
time: "O(n log k)"
space: "O(k)"
---

## Description

Given an integer array `nums` and an integer `k`, return the `k`th largest element in sorted
order. Duplicate values occupy separate positions.

**Example**

```
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
```

In descending order the array is `[6,5,4,3,2,1]`, whose second element is `5`.

## Intuition

The answer depends only on the largest `k` values. Keeping those values in a min-heap places their
smallest member at the root, which is the current `k`th largest. A later value only matters if it
is greater than that boundary.

## Approach

1. Copy the first `k` values into `heap` and heapify them in place.
2. For each remaining `num`, compare it with `heap[0]`, the smallest retained value.
3. If `num` is larger, replace the root with it; otherwise discard `num`.
4. Keep duplicates as separate heap entries because the requested rank is not distinct-value rank.
5. Return `heap[0]`, the smallest of the largest `k` values.

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

After initialization, the heap contains the largest `k` values of the processed prefix. For a new
value, if it does not exceed the root, at least `k` retained values are as large, so discarding it
preserves the invariant. Otherwise replacing the root removes the only retained value displaced
from the top `k`. By induction, the final heap contains the array's largest `k` values, and its
minimum is the requested element.

**Complexity**

- **Time:** `O(n log k)` in the worst case, including `O(k)` heap construction.
- **Space:** `O(k)` for the heap.
