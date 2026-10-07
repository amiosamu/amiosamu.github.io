---
# Greatest Common Divisor Traversal · Hard · Advanced Graphs
# https://leetcode.com/problems/greatest-common-divisor-traversal
draft: false
pattern: "Union-Find over shared prime factors"
time: "O(n * sqrt(M))"
space: "O(n log M)"
---

## Description

Given `nums`, allow a move between indices `i` and `j` when
`gcd(nums[i], nums[j]) > 1`. Return whether every pair of indices is connected by a
sequence of such moves.

**Example**

```
Input: nums = [2,3,6]
Output: true
```

Explanation: Both `2` and `3` share a factor with `6`, so index `2` connects all indices.

## Intuition

Two values have a greatest common divisor above one exactly when they share a prime factor.
Instead of testing all `O(n^2)` index pairs, factor each value and join indices that share
a prime.

For each prime, it is enough to remember one previously seen index. Unioning every later
index with that representative connects all indices containing the prime, and union-find
also captures paths formed through several different primes.

## Approach

1. Return `True` for one value. For multiple values, return `False` if any value is `1`,
   because that index cannot have an edge.
2. Initialize union-find over indices. `par` stores parents, while `rank` stores component
   sizes for weighted unions.
3. Factor each value by trial division. Remove all copies of a discovered prime, then
   union the current index with the representative stored in `primeToIndex`.
4. Process a remaining `x > 1` after trial division; it is the value's final prime factor.
5. Return whether every index has the same root as index `0`. Factorization uses a copy of
   each number and does not mutate `nums`.

## Code

```python
class Solution:
    def canTraverseAllPairs(self, nums: List[int]) -> bool:
        n = len(nums)
        if n == 1:
            return True
        if 1 in nums:
            return False

        par = list(range(n))
        rank = [1] * n

        def find(x):
            while par[x] != x:
                par[x] = par[par[x]]
                x = par[x]
            return x

        def union(a, b):
            ra, rb = find(a), find(b)
            if ra == rb:
                return
            if rank[ra] < rank[rb]:
                ra, rb = rb, ra
            par[rb] = ra
            rank[ra] += rank[rb]

        primeToIndex = {}

        for i, num in enumerate(nums):
            x = num
            p = 2
            while p * p <= x:
                if x % p == 0:
                    while x % p == 0:
                        x //= p
                    if p in primeToIndex:
                        union(i, primeToIndex[p])
                    else:
                        primeToIndex[p] = i
                p += 1
            if x > 1:
                if x in primeToIndex:
                    union(i, primeToIndex[x])
                else:
                    primeToIndex[x] = i

        root = find(0)
        return all(find(i) == root for i in range(n))
```

## Why it works

All indices containing a prime `p` are unioned with the same representative, so every
direct graph edge implied by `p` lies within one union-find component. Conversely, each
union joins indices sharing a prime and therefore corresponds to a valid graph edge.
Union-find components thus equal the graph's connected components. Trial division plus
the leftover-prime check finds every distinct prime factor, so the final root comparison
is true exactly when all indices are mutually reachable.

**Complexity**

- **Time:** `O(n sqrt(M))`, where `M = max(nums)`; union-find work is lower order.
- **Space:** `O(n log M)` in the stated upper bound for parents and prime representatives.
