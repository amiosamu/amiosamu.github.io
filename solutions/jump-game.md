---
# Jump Game · Medium · Greedy
# https://leetcode.com/problems/jump-game/
draft: false
pattern: "Track furthest reachable index"
time: "O(n)"
space: "O(1)"
---

## Intuition

The brute force explores every jump length from every index, which is exponential, and the DP
version is O(n²). The observation that collapses both: because a jump of length `nums[i]` lets me
land on *any* index in `[i+1, i+nums[i]]`, the set of reachable indices is always a contiguous
prefix `[0, reach]`. There are no holes to keep track of, so the entire reachable set is one
integer. I scan left to right, and the only question at each index is whether I have already fallen
off the end of that prefix.

## Approach

1. Keep `reach`, the furthest index reachable from `0` using the elements seen so far. Start at 0 —
   index 0 is trivially reachable.
2. Iterate with `for i, jump in enumerate(nums)`.
3. Before using index `i`, check `if i > reach: return False`. If `i` is past the prefix I can
   reach, nothing beyond it is reachable either (the prefix only ever grows from indices inside it),
   so the answer is settled.
4. Otherwise `i` is reachable, so its jump is usable: `reach = max(reach, i + jump)`.
5. If the loop finishes, `i` got all the way to `len(nums) - 1` without ever exceeding `reach`, so
   the last index is reachable — return `True`.
6. Zeros are the only interesting failure: they stop extending `reach`, and the loop fails the
   moment `i` walks past the last `reach` some earlier index provided. `nums = [0]` returns `True`
   because index 0 is the target.

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

The invariant is that the reachable set is exactly `[0, reach]`, and it is genuinely an interval:
if `j > 0` is reachable then some `i < j` has `i + nums[i] >= j`, and that same jump can land
short, on every index between `i+1` and `j`. So there is nothing to choose greedily — keeping only
the maximum endpoint discards no information, because every index below it is reachable anyway.
Failing at the first `i > reach` is safe for the same reason: `reach` can only be extended from
indices at most `reach`, all of which have already been scanned, so it will never grow again. One
pass, one integer: O(n) time and O(1) space.
