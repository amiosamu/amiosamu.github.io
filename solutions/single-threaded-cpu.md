---
# Single Threaded CPU · Medium · Heap / Priority Queue
# https://leetcode.com/problems/single-threaded-cpu/
draft: false
pattern: "Sort by enqueue, min-heap by duration"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given `tasks[i] = [enqueueTime, processingTime]`, return the original indices in the order a
single-threaded CPU runs them. Among available tasks, it chooses the shortest processing time,
then the smallest index; it idles when no task is available.

**Example**

```
Input: tasks = [[1,2],[2,4],[3,2],[4,1]]
Output: [0,2,3,1]
```

Explanation: Task `0` runs first. At time `3`, tasks `1` and `2` are available, so task `2`
runs next; task `3` arrives while it runs, then precedes task `1` because it is shorter.

## Intuition

Tasks arrive in enqueue-time order but are selected in processing-time order. Sort indexed tasks
once to sweep arrivals, and keep all currently available tasks in a min-heap keyed by
`(processing, index)`. Python tuple ordering implements both selection rules.

The CPU is non-preemptive, so arrivals during a task matter only after it finishes. If the heap
is empty, the clock can jump directly to the next enqueue time.

## Approach

1. Sort `(enqueue, processing, index)` triples and sweep them with pointer `i`.
2. At each decision time, push every task with `enqueue <= time` into `available` as
   `(processing, index)`.
3. If the heap is empty, jump `time` to the next task's enqueue time and repeat the arrival
   step rather than advancing one unit at a time.
4. Otherwise pop the minimum task, append its index, and advance `time` by its processing time.
5. Continue until `order` contains every task. The heap's second tuple field resolves equal
   processing times by original index.

## Code

```python
import heapq

class Solution:
    def getOrder(self, tasks: List[List[int]]) -> List[int]:
        indexed = sorted((enqueue, processing, i)
                         for i, (enqueue, processing) in enumerate(tasks))
        n = len(tasks)

        available = []
        order = []
        time = 0
        i = 0

        while len(order) < n:
            while i < n and indexed[i][0] <= time:
                _, processing, idx = indexed[i]
                heapq.heappush(available, (processing, idx))
                i += 1

            if not available:
                time = indexed[i][0]
                continue

            processing, idx = heapq.heappop(available)
            time += processing
            order.append(idx)

        return order
```

## Why it works

At each scheduling decision, all sorted tasks with enqueue time at most `time` have been pushed,
and no later task is available. The heap therefore contains exactly the available, unfinished
tasks. Its minimum is precisely the required shortest task with the required index tie-break.
After a task completes, the invariant is restored by adding new arrivals. If none is available,
jumping to the next enqueue time skips only unavoidable idle time. By induction, every appended
index is the CPU's next legal choice.

**Complexity**

- **Time:** `O(n log n)` for sorting and one heap push and pop per task.
- **Space:** `O(n)` for the sorted triples, heap, and returned order; `O(n)` auxiliary space
  excluding the output as well.
