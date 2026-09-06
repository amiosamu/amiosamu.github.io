---
# IPO · Hard · Heap / Priority Queue
# https://leetcode.com/problems/ipo/
draft: false
pattern: "Sort by capital, max-heap on profit"
time: "O(n log n)"
space: "O(n)"
---

## Intuition

Picking the k most profitable projects outright is wrong — the best ones may be unaffordable at the start — and re-scanning all n projects on each of the k rounds is O(n·k). The saving observation is that capital only ever *increases*, so the affordable set only ever grows: once a project becomes unlockable it stays unlockable forever. So I sort the projects by capital once and sweep a pointer through them, dumping each newly affordable project into a **max-heap keyed by profit** (negated for `heapq`), and each round takes that heap's root. Greedy is safe because profits are non-negative, so taking the largest one can never restrict the future.

## Approach

1. Zip and sort: `projects = sorted(zip(capital, profits))`. Sorting the pairs orders by capital first, which is the only field the sweep uses.
2. Keep `available`, a max-heap of negated profits, a sweep pointer `i = 0`, and the running capital `w`.
3. Repeat at most `k` times. First unlock: `while i < n and projects[i][0] <= w`, push `-projects[i][1]` and advance `i`. Because the list is sorted by capital and `w` never decreases, `i` only moves forward — each project is unlocked at most once across the whole run.
4. If `available` is empty after unlocking, `break`. Nothing is affordable and nothing ever will be, since `w` cannot grow without finishing a project.
5. Otherwise `w -= heapq.heappop(available)` — subtracting a negated profit adds it. Do not push the project back; each may be taken only once.
6. Return `w` after the loop, whether it ran all k rounds or broke early.
7. Note the heap holds profits only — once a project is affordable its capital requirement is irrelevant, so nothing else needs to be carried.

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

The greedy exchange argument: since profits are non-negative, capital after j projects is monotonically non-decreasing in the profits chosen, so a set of j projects with a larger total is affordable at every future step that the smaller set was — swapping a lower-profit pick for the highest available one never invalidates a later choice and never lowers the final capital. The sorted sweep guarantees the heap always contains exactly the unstarted projects whose capital requirement is met, because `w` only grows and the pointer only advances. Sorting is O(n log n) and every project is pushed and popped at most once, so the total is O(n log n) time and O(n) space.
