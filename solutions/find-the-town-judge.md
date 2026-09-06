---
# Find the Town Judge · Easy · Graphs
# https://leetcode.com/problems/find-the-town-judge
draft: false
pattern: "In-degree minus out-degree tally"
time: "O(E + n)"
space: "O(n)"
---

## Intuition

`trust` is a directed graph: the people are the nodes and `[a, b]` is an edge `a -> b`
meaning "a trusts b". The judge is stated purely in degree terms — in-degree `n - 1`
(everybody else trusts them) and out-degree `0` (they trust nobody).

I do not need two arrays for that. Keep one `score[p] = indegree(p) - outdegree(p)`: `+1`
when `p` is trusted, `-1` when `p` trusts. Nobody trusts themselves, so in-degree can never
exceed `n - 1`, which means `score[p] == n - 1` forces in-degree to be exactly `n - 1` *and*
out-degree to be exactly `0`. One number identifies the judge.

## Approach

1. Allocate `score = [0] * (n + 1)` so people `1..n` index directly and slot `0` is unused.
2. For each `a, b` in `trust`: `score[a] -= 1` and `score[b] += 1`.
3. Scan `i` from `1` to `n` and return `i` the moment `score[i] == n - 1`.
4. If the scan finds nobody, return `-1`.
5. The `n == 1`, `trust == []` case needs no special handling: `score[1] == 0 == n - 1`, so
   person 1 is correctly reported as the judge.

## Code

```python
class Solution:
    def findJudge(self, n: int, trust: List[List[int]]) -> int:
        score = [0] * (n + 1)

        for a, b in trust:
            score[a] -= 1
            score[b] += 1

        for i in range(1, n + 1):
            if score[i] == n - 1:
                return i

        return -1
```

## Why it works

Since `[a, a]` never appears, in-degree is capped at `n - 1` and out-degree is non-negative,
so `indegree - outdegree == n - 1` is achievable only by `indegree = n - 1, outdegree = 0` —
exactly the judge's definition, so the test is both sound and complete. At most one node can
score `n - 1`: if two did, each would have to be trusted by the other, giving both a non-zero
out-degree and dropping their scores. Building the tally is one pass over the edges and the
scan is one pass over the people, so `O(E + n)` time and `O(n)` space.
