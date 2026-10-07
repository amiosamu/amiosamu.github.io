---
# IPO · Hard · Heap / Priority Queue
# https://leetcode.com/problems/ipo/
draft: false
pattern: "Sort by capital, max-heap on profit"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given initial capital `w` and projects with capital requirements and nonnegative profits,
choose at most `k` distinct projects to maximize final capital. A project is available only
when current capital meets its requirement.

**Example**

```
Input: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]
Output: 4
```

Explanation: Project `0` raises capital to `1`, making the project with profit `3`
available and producing final capital `4`.

## Intuition

Because profits are nonnegative, capital never decreases and an affordable project remains
affordable. Sort projects by required capital and sweep once, adding newly affordable
profits to a max-heap.

At each choice, the largest available profit produces at least as much capital as any other
available project. That can only preserve or enlarge the set available in later rounds.

## Approach

1. Build and sort `(required_capital, profit)` pairs. This allocates a new list and leaves
   both input arrays unchanged.
2. Track `i`, the next sorted project not yet added, and `available`, a heap of negated
   profits so Python's min-heap acts as a max-heap.
3. Before each of at most `k` choices, push every project with requirement at most `w`.
   The pointer advances only once through the sorted list.
4. Stop if the heap is empty, because no project can increase capital and unlock another.
5. Otherwise pop the largest profit, add it to `w`, and return `w` after the choices end.

## Code

```python
import heapq

class Solution:
    def findMaximizedCapital(self, k: int, w: int, profits: List[int], capital: List[int]) -> int:
        projects = sorted(zip(capital, profits))
        n = len(projects)

        available = []
        i = 0

        for _ in range(k):
            while i < n and projects[i][0] <= w:
                heapq.heappush(available, -projects[i][1])
                i += 1

            if not available:
                break
            w -= heapq.heappop(available)

        return w
```

## Why it works

Consider an optimal sequence whose next choice is `q`, while the greedy choice is an
available project `p` with at least as much profit. Replacing `q` with `p` leaves at least
as much capital after that step, so every later project in the optimal sequence remains
affordable. If `p` appeared later, `q` can take its place then; otherwise the sequence simply
keeps its later choices. Thus an optimal sequence can begin with the greedy choice. Repeating
this exchange proves all greedy choices are optimal. The sorted sweep and heap contain
exactly the currently affordable unchosen projects.

**Complexity**

- **Time:** `O(n log n)` because at most `n` projects are pushed and selected.
- **Space:** `O(n)` for the sorted project list and heap.
