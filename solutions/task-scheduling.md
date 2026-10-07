---
# Task Scheduler · Medium · Heap / Priority Queue
# https://leetcode.com/problems/task-scheduler/
draft: false
pattern: "Frequency lower bound and schedule length"
time: "O(m)"
space: "O(1)"
---

## Description

Given uppercase CPU tasks and a cooldown `n`, schedule all tasks so equal letters are separated by
at least `n` intervals. Return the minimum number of intervals, including any required idle time.

**Example**

```
Input: tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
```

One optimal schedule is `A, B, idle, A, B, idle, A, B`, which uses eight intervals.

## Intuition

Let the largest task frequency be `max_freq`. Its first `max_freq - 1` occurrences begin blocks
that must span at least `n + 1` intervals before the next copy can run. If `max_count` task types
share that largest frequency, all of their final copies occupy the tail after those blocks.

This forces a lower bound of `(max_freq - 1) * (n + 1) + max_count`. When other tasks fill all
cooldown slots, the schedule instead needs only `len(tasks)` intervals. The larger bound is exact.

## Approach

1. Count each task type and compute `max_freq`, the largest count.
2. Count how many task types have frequency `max_freq`; call this `max_count`.
3. Compute the forced frame length `(max_freq - 1) * (n + 1) + max_count`.
4. Return the larger of that frame length and `len(tasks)`.

## Code

```python
import collections

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        counts = collections.Counter(tasks)
        max_freq = max(counts.values())
        max_count = sum(freq == max_freq for freq in counts.values())
        frame = (max_freq - 1) * (n + 1) + max_count
        return max(len(tasks), frame)
```

## Why it works

Any schedule must contain all `m` tasks. It must also separate the first `max_freq - 1` copies of
a most-frequent task into blocks of width at least `n + 1`; the `max_count` tied final copies add
the tail, proving the frame lower bound. This bound is attainable: place the tied most-frequent
tasks once in each block, then distribute all other tasks among the open block positions. If they
fit, the frame length is achieved; if they overflow, they fill every idle position and extend the
schedule to exactly `m`. Therefore the maximum of the two lower bounds is optimal.

**Complexity**

- **Time:** `O(m)` to count `m = len(tasks)` tasks.
- **Space:** `O(1)` because the alphabet contains only 26 task types.
