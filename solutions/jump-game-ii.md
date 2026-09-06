---
# Jump Game II · Medium · Greedy
# https://leetcode.com/problems/jump-game-ii/
draft: false
pattern: "BFS levels without a queue"
time: "O(n)"
space: "O(1)"
---

## Intuition

This is a shortest-path problem on an unweighted graph, so it is BFS — but the graph has enough
structure that the queue is unnecessary. The set of indices reachable in at most `k` jumps is a
contiguous prefix `[0, endₖ]`, so a BFS "level" is just an interval of indices, and the next
level's boundary is `max(i + nums[i])` over the current interval. So I sweep left to right once,
accumulating `farthest`, and every time I hit the right edge of the current level I spend a jump
and open the next one. No queue, no visited set.

## Approach

1. Keep three integers: `jumps` (the answer), `end` (the right edge of the current BFS level), and
   `farthest` (the furthest index anything in the current level can reach).
2. Loop `i` from `0` to `len(nums) - 2`. Stopping one short of the end matters: reaching the last
   index means I am done, and iterating onto it would count one extra jump.
3. Each iteration, `farthest = max(farthest, i + nums[i])` — accumulate the next level's boundary.
4. `if i == end:` I have consumed the whole current level, so any further progress costs a jump:
   `jumps += 1` and `end = farthest`.
5. Return `jumps`. The problem guarantees the last index is reachable, so no failure case.
6. Trace `[2,3,1,1,4]`: at `i=0`, `farthest=2`, `i==end=0` so `jumps=1, end=2`. At `i=1`,
   `farthest=4`. At `i=2`, `i==end` so `jumps=2, end=4`. Loop stops after `i=3`. Answer 2.

## Code

```python
class Solution:
    def jump(self, nums: List[int]) -> int:
        jumps = 0
        end = 0
        farthest = 0

        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            if i == end:
                jumps += 1
                end = farthest

        return jumps
```

## Why it works

Let `Rₖ` be the set of indices reachable in at most `k` jumps. `R₀ = {0}`, and since a jump from
`i` may land on any index up to `i + nums[i]`, each `Rₖ` is a contiguous prefix `[0, endₖ]` with
`endₖ₊₁ = max(i + nums[i])` over `i ≤ endₖ` — exactly what `farthest` accumulates. Because levels
are nested prefixes, there is no choice to make and nothing to regret: the minimum number of jumps
to reach `n-1` is the least `k` with `endₖ ≥ n-1`, and `jumps` increments once per level boundary
crossed, which is that `k`. Each index is visited once and only scalars are stored, so O(n) time
and O(1) space.
