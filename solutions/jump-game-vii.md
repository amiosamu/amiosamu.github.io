---
# Jump Game VII · Medium · Greedy
# https://leetcode.com/problems/jump-game-vii/
draft: false
pattern: "Reachability DP with sliding-window count"
time: "O(n)"
space: "O(n)"
---

## Description

Given a binary string `s` and integers `minJump` and `maxJump`, return whether the last index
is reachable from index `0`. A jump from `i` may land on `j` when its length is in the given
range and `s[j] == '0'`.

**Example**

```
Input: s = "011010", minJump = 2, maxJump = 3
Output: true
```

Jump from index `0` to index `3`, then from index `3` to the final index `5`.

## Intuition

An index `i` is reachable exactly when it contains `0` and some reachable index lies between
`i - maxJump` and `i - minJump`. A direct dynamic program would scan this entire range for each
index. Maintaining the number of reachable indices in that sliding range reduces each query to
constant time.

## Approach

1. Create `dp`, where `dp[i]` records whether index `i` is reachable, and set `dp[0] = True`.
2. Maintain `pre`, the count of reachable indices in `[i - maxJump, i - minJump]`.
3. Before evaluating each `i`, add the new right endpoint and remove the expired left endpoint.
4. Set `dp[i]` when `pre > 0` and `s[i] == '0'`; blocked positions remain unreachable.
5. Return `dp[-1]`. All window positions precede `i`, so their states are already final.

## Code

```python
class Solution:
    def canReach(self, s: str, minJump: int, maxJump: int) -> bool:
        n = len(s)
        dp = [False] * n
        dp[0] = True
        pre = 0

        for i in range(1, n):
            if i >= minJump:
                pre += dp[i - minJump]
            if i > maxJump:
                pre -= dp[i - maxJump - 1]
            dp[i] = pre > 0 and s[i] == '0'

        return dp[n - 1]
```

## Why it works

For each `i`, `pre` counts exactly the reachable origins whose jump lengths to `i` are between
`minJump` and `maxJump`. Thus `dp[i]` is true precisely when a legal origin exists and the landing
cell is `0`. This is both necessary and sufficient for reaching `i`. Since `dp[0]` is correct and
the recurrence uses only earlier indices, induction proves every entry, including `dp[-1]`, is
correct.

**Complexity**

- **Time:** `O(n)`, because each index enters and leaves the window once.
- **Space:** `O(n)` for the reachability array.
