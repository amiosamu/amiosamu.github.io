---
# Single Threaded CPU · Medium · Heap / Priority Queue
# https://leetcode.com/problems/single-threaded-cpu/
draft: false
pattern: "Sort by enqueue, min-heap by duration"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given `tasks` where `tasks[i] = [enqueueTime, processingTime]`, a single-threaded CPU processes one task at a time, always picking the available task with the shortest processing time (ties broken by smallest index), and idles if nothing is available yet. Return the order in which the tasks are processed, by original index.

**Example**

```
Input: tasks = [[1,2],[2,4],[3,2],[4,1]]
Output: [0,2,3,1]
```

Explanation: at time 1 only task 0 is available, so it runs until time 3; by then tasks 1-3 have all arrived, and among processing times `4, 2, 1` the shortest, task 3 (time 1), runs next, then task 2 (time 2), then task 1.

## Intuition

There are two different orders in play and no single sort can serve both: tasks *become available* in enqueue-time order, but they are *chosen* in shortest-processing-time order. Sorting once by enqueue time handles the arrivals, and since the set of available tasks changes every time the clock jumps, the choice has to come from a structure that accepts new members cheaply and always exposes the minimum — a **min-heap keyed by `(processingTime, index)`**, where the index is the problem's own tie-break for equal durations.

## Approach

1. Build `indexed = sorted((enqueue, processing, i) for i, (enqueue, processing) in enumerate(tasks))` so arrivals can be swept with a single pointer `i`. Sorting the triples sorts by enqueue time first, which is all that matters.
2. Keep `available` (the min-heap), `order` (the answer), a clock `time = 0`, and the sweep pointer `i = 0`.
3. Loop until `len(order) == n`. First drain every task with `indexed[i][0] <= time` into the heap as `(processing, idx)` — those are the tasks the CPU can see right now.
4. If the heap is empty the CPU is idle: jump `time = indexed[i][0]`, the next arrival, and `continue`. Do not step the clock by one; the gaps can be huge.
5. Otherwise pop `(processing, idx)`, add `processing` to `time`, and append `idx` to `order`. Running a task is atomic — the problem forbids preemption — so nothing is checked until it finishes.
6. The heap tuple's second field is the original index, so ties on `processing` resolve to the smallest index exactly as the problem requires; that is why I carry `idx` and not the task itself.
7. Step 3 must run *after* the clock jumps in steps 4 and 5, because tasks that arrived while the CPU was busy only become choosable at the next decision point.

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

At every moment the CPU makes a decision, the heap contains exactly the tasks that have been enqueued and not yet run, so popping its minimum is precisely the rule the problem states; the clock only ever moves forward, to a task's completion or to the next arrival, so no arrival is skipped and no idle time is invented. The heap can never be empty at step 4 with `i == n`, because `len(order) < n` means some task is still outstanding and an outstanding task is either in the heap or has yet to arrive. Sorting is O(n log n) and each task is pushed and popped exactly once at O(log n), so the total is O(n log n) with O(n) for the sorted copy and the heap.
