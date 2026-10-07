---
# Jump Game · Medium · Greedy
# https://leetcode.com/problems/jump-game/
draft: false
pattern: "Track furthest reachable index"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array `nums`, where `nums[i]` is the maximum jump length from index `i`, return
whether the last index can be reached from index `0`.

**Example**

```
Input: nums = [2,3,1,1,4]
Output: true
```

Jump from index `0` to index `1`, then from index `1` to the last index.

## Intuition

A reachable index can jump to every position up to its maximum range, not only to the endpoint.
Consequently, the reachable indices always form a prefix ending at `reach`. Scanning that prefix
can extend its boundary; encountering an index beyond it proves that no later index is reachable.

## Approach

1. Initialize `reach = 0`, since the starting index is reachable without a jump.
2. Scan each index `i` and its maximum `jump` from left to right.
3. If `i > reach`, return `False`; no previously reachable index can jump as far as `i`.
4. Otherwise extend the reachable prefix with `reach = max(reach, i + jump)`.
5. Return `True` after scanning the array. This also handles `[0]`, where the start is the target.

## Code

```python
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        reach = 0

        for i, jump in enumerate(nums):
            if i > reach:
                return False
            reach = max(reach, i + jump)

        return True
```

## Why it works

Before each iteration, every index through `reach` is reachable from index `0`. If `i <= reach`,
then `i` is reachable and can extend that prefix through `i + nums[i]`, preserving the invariant.
If `i > reach`, all reachable indices have already been processed and none can reach `i`; therefore
no unprocessed index can be reached either. The algorithm returns `True` exactly when the scan can
include the final index.

**Complexity**

- **Time:** `O(n)` for one scan.
- **Space:** `O(1)` auxiliary space.
