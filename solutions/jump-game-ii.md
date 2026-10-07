---
# Jump Game II · Medium · Greedy
# https://leetcode.com/problems/jump-game-ii/
draft: false
pattern: "BFS levels without a queue"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array `nums`, where `nums[i]` is the maximum jump length from index `i`, return the
minimum number of jumps needed to reach the last index from index `0`. The last index is
guaranteed to be reachable.

**Example**

```
Input: nums = [2,3,1,1,4]
Output: 2
```

Jump from index `0` to index `1`, then from index `1` to index `4`.

## Intuition

Indices reachable with a fixed number of jumps form a contiguous range, so breadth-first-search
levels can be represented by their right boundaries. While scanning one level, `farthest` records
the furthest index reachable by one additional jump. Reaching the current boundary commits that
jump and begins scanning the next level.

## Approach

1. Track `end`, the right edge reachable with `jumps` jumps, and `farthest`, the next edge.
2. Scan indices from `0` through the penultimate index; the target itself needs no outgoing jump.
3. At each index, update `farthest` with `i + nums[i]`.
4. When `i == end`, the current level is exhausted; increment `jumps` and set `end = farthest`.
5. Return `jumps`. Reachability is guaranteed, so every required level extends beyond its boundary.

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

After completing a level, `end` is the greatest index reachable with `jumps` jumps. This holds
initially for index `0` and zero jumps. Scanning every index through `end` computes the maximum
`i + nums[i]`, which is exactly the greatest index reachable with one more jump. Updating `end`
therefore preserves the invariant. The first level whose boundary reaches the last index uses the
fewest possible jumps, because no earlier BFS level could reach it.

**Complexity**

- **Time:** `O(n)` for one left-to-right scan.
- **Space:** `O(1)` auxiliary space.
