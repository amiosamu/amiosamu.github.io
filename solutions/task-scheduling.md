---
# Task Scheduler · Medium · Heap / Priority Queue
# https://leetcode.com/problems/task-scheduler/
draft: false
pattern: "Greedy max-heap with cooldown queue"
time: "O(m * n)"
space: "O(1)"
---

## Intuition

The identity of a task is irrelevant — only how many times each letter still has to run. The bottleneck is the most frequent letter, because it forces gaps of `n` around every one of its runs, and the cheapest way to fill those gaps is with the *next* most frequent letters, since leaving them for later only creates more gaps later. So at every tick I want the largest remaining count that is not still cooling down: a **max-heap** of counts (negated, because `heapq` is a min-heap) for what is runnable, plus a FIFO queue for what is on cooldown, since tasks come off cooldown in exactly the order they went on.

## Approach

1. Count the tasks with `collections.Counter` and build `heap = [-c for c in counts.values()]`, then `heapify`. Negated counts make `heap[0]` the letter with the most work left.
2. Keep `queue`, a `deque` of `(remaining, ready_time)` pairs for tasks in cooldown, and a clock `time` starting at 0.
3. Loop while either structure is non-empty. Advance `time += 1` first — that tick is spent either running a task or idling.
4. If the heap is non-empty, pop `count` (negative) and add 1 to spend one execution. If it is still non-zero, append `(count, time + n)` to the queue. If the heap is empty this tick is a forced idle and nothing is popped.
5. Then, if `queue` and `queue[0][1] == time`, `popleft` and push its count back on the heap. Doing this *after* the pop is what enforces the cooldown: a task queued at `time` with `ready_time = time + n` cannot be chosen again until n other ticks have passed.
6. Because `time` advances by exactly 1 per iteration and ready times are always `time + n`, checking equality on the queue front is enough — no ready task is ever missed.
7. Return `time` when both the heap and the queue are empty.

## Code

```python
import collections
import heapq

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        counts = collections.Counter(tasks)
        heap = [-c for c in counts.values()]
        heapq.heapify(heap)

        queue = collections.deque()  # (negated remaining count, time it becomes runnable)
        time = 0

        while heap or queue:
            time += 1
            if heap:
                count = heapq.heappop(heap) + 1
                if count:
                    queue.append((count, time + n))
            if queue and queue[0][1] == time:
                heapq.heappush(heap, queue.popleft()[0])

        return time
```

## Why it works

The greedy choice — always run the runnable task with the most copies left — is safe by an exchange argument: if a schedule ever runs a rarer task while a more frequent one is available, swapping the two never makes any cooldown violated and never lengthens the schedule, because the more frequent task is the one that will still need slots at the end. The queue makes the cooldown exact rather than approximate, so the simulation is a legal schedule, and the greedy guarantees it is a shortest one. The loop body is O(log 26) = O(1), and it runs once per time unit, at most `(maxCount - 1) * (n + 1) + 26` ticks — O(m * n) in the worst case for `m = len(tasks)` — with only 26 counters live, so O(1) space.
