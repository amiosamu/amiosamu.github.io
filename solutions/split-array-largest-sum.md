---
# Split Array Largest Sum · Hard · Binary Search
# https://leetcode.com/problems/split-array-largest-sum/
draft: false
pattern: "Binary search on the answer"
time: "O(n log(sum(nums)))"
space: "O(1)"
---

## Description

Given an array of non-negative integers `nums` and an integer `k`, split `nums` into `k` non-empty contiguous subarrays so as to minimize the largest sum among those subarrays, and return that minimized largest sum.

**Example**

```
Input: nums = [7,2,5,10,8], k = 2
Output: 18
```

Explanation: Splitting into `[7,2,5]` and `[10,8]` gives sums 14 and 18; no split into 2 parts achieves a smaller maximum than 18.

## Intuition

The DP over "first `i` elements into `j` parts" is `O(n^2 * k)` and is the wrong instinct here. Invert the question: instead of asking "what is the smallest achievable maximum subarray sum", ask "can I do it with all parts `<= cap`" — and that is monotone in `cap`, so I binary search `cap` in `[max(nums), sum(nums)]`. For a fixed `cap` the greedy is forced: keep extending the current part while it fits, cut when it would overflow, which uses the fewest parts possible. This is literally Capacity to Ship Packages with `k` renamed.

## Approach

1. Write `subarrays(cap)`: start `count = 1`, `cur = 0`; for each `x` in `nums`, if `cur + x > cap` start a new part (`count += 1`, `cur = 0`), then `cur += x`. Return `count`.
2. Search space: the interval `[l, r]` over candidate maxima, **inclusive on both ends**, with `l = max(nums)` (no part can be smaller than its largest element) and `r = sum(nums)` (one part holding everything, always achievable since `k >= 1`).
3. Monotone predicate: `P(cap) = subarrays(cap) <= k`. Raising `cap` can only merge parts, never split them, so `P` is false on a prefix and true on a suffix; the answer is the first true.
4. Invariant: every `cap < l` needs more than `k` parts, every `cap > r` needs at most `k`.
5. Loop `while l <= r`, `mid = (l + r) // 2`.
6. If `subarrays(mid) <= k`, `mid` is achievable but perhaps not minimal: `r = mid - 1`. Otherwise `mid` is too tight: `l = mid + 1`.
7. On exit `l == r + 1`, so `l` is the smallest achievable maximum — return `l`.
8. Note that using *fewer* than `k` parts is fine: any split into `count < k` parts can be refined into exactly `k` parts by cutting further, which only lowers part sums, so `<= k` is the right comparison rather than `== k`.

## Code

```python
class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        def subarrays(cap: int) -> int:
            count, cur = 1, 0
            for x in nums:
                if cur + x > cap:
                    count += 1
                    cur = 0
                cur += x
            return count

        l, r = max(nums), sum(nums)
        while l <= r:
            mid = (l + r) // 2
            if subarrays(mid) <= k:
                r = mid - 1
            else:
                l = mid + 1
        return l
```

## Why it works

Greedy cutting minimises the number of parts for a given `cap`: after processing each prefix it holds the smallest possible part count and, among those, the largest remaining room, so no other split can finish in fewer parts. Therefore `subarrays(cap) <= k` is exactly "a valid split with maximum `<= cap` exists", it is monotone in `cap`, and the boundary the loop converges on is the minimum achievable maximum. The search runs `O(log(sum(nums)))` iterations of an `O(n)` greedy pass, using `O(1)` extra space.
