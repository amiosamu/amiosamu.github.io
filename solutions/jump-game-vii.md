---
# Jump Game VII · Medium · Greedy
# https://leetcode.com/problems/jump-game-vii/
draft: false
pattern: "Reachability DP with sliding-window count"
time: "O(n)"
space: "O(n)"
---

## Intuition

The greedy reflex from the other Jump Game problems is wrong here, and it is worth saying why: with
a `minJump` floor the reachable set is no longer a prefix — there is a forbidden gap right after
every landing — and a landing spot can be a `'1'`, so "jump as far as you can" can strand you.
Reachability really has to be computed per index. The saving grace is that index `i` is reachable
iff `s[i] == '0'` and *at least one* index in the fixed window `[i - maxJump, i - minJump]` is
reachable. That's an "any true in a sliding window" query, which a running count answers in O(1) as
the window slides, turning an O(n·maxJump) DP into O(n).

## Approach

1. `n = len(s)`. Allocate `dp = [False] * n` and set `dp[0] = True`; `s[0]` is guaranteed `'0'`.
2. Keep `pre`, the number of `True` entries of `dp` currently inside the window
   `[i - maxJump, i - minJump]`.
3. Loop `i` from 1 to `n - 1`, and slide the window *before* reading it:
   - if `i >= minJump`, the index `i - minJump` just entered the window: `pre += dp[i - minJump]`
     (a `bool` adds as 0/1).
   - if `i > maxJump`, the index `i - maxJump - 1` just fell off the left: `pre -= dp[i - maxJump - 1]`.
4. Then `dp[i] = pre > 0 and s[i] == '0'`. Both conditions are required: something must be able to
   jump here, and the landing must not be a `'1'`.
5. The window entries are all `< i`, so `dp` is always read at already-finalised indices — the
   single left-to-right pass is a valid evaluation order.
6. Return `dp[n - 1]`.

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

The recurrence is exhaustive because a jump into `i` must originate somewhere in
`[i - maxJump, i - minJump]` and every such origin is a legal source, so `dp[i]` is true exactly
when that window contains a reachable index and `s[i] == '0'`. Nothing is discarded, which is the
point — the plausible greedy of always taking the furthest legal `'0'` fails on inputs where the
far landing's own window lands entirely on `'1'`s while a nearer landing's does not, so a genuine
DP is required. The window advances one step per index and `pre` is repaired with one add and one
subtract, giving O(n) time; the `dp` array is the O(n) space.
