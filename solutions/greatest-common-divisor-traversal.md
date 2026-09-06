---
# Greatest Common Divisor Traversal · Hard · Advanced Graphs
# https://leetcode.com/problems/greatest-common-divisor-traversal
draft: false
pattern: "Union-Find over shared prime factors"
time: "O(n * sqrt(M))"
space: "O(n log M)"
---

## Description

Given an array `nums`, determine whether it is possible to traverse between every pair of
indices, where a direct move between index `i` and index `j` is allowed exactly when
`gcd(nums[i], nums[j]) > 1`. Return `True` if every pair of indices is connected by some
sequence of such moves, `False` otherwise.

**Example**

```
Input: nums = [2,3,6]
Output: true
```

Explanation: `gcd(2, 6) = 2 > 1` and `gcd(3, 6) = 3 > 1`, so both index 0 and index 1 are
directly connected to index 2, which links all three indices into a single component.

## Intuition

The question is whether the graph "connect `i` and `j` when `gcd(nums[i], nums[j]) > 1`" is a single connected component. Building it directly needs all O(n²) pairs. The insight is that `gcd > 1` means the two numbers share a prime, so instead of linking numbers to numbers I link each number to the *primes* it contains: two numbers sharing prime `p` end up in the same component through `p`, transitively and for free. In practice I don't even need node ids for primes — I just remember the first index that used each prime and union the current index with it. Everything then reduces to one union-find over `n` indices.

## Approach

1. Handle the two degenerate cases first: `n == 1` is trivially connected, and if `n > 1` and any element is `1`, that element shares no prime with anything, so return `False`.
2. Set up union-find over the indices `0..n-1`: `par = list(range(n))`, `rank = [1] * n`, an iterative `find` with path halving, and a `union` that merges the smaller tree into the larger.
3. Keep `primeToIndex`, a map from a prime to the first index whose value was divisible by it.
4. For each index `i` and value `num`, factorise a copy `x` by trial division: for `p` from `2` while `p * p <= x`, divide `x` by `p` completely whenever `p` divides it.
5. Each time a prime `p` is found, union `i` with `primeToIndex[p]` if the prime has been seen, otherwise record `primeToIndex[p] = i`.
6. After the loop, if `x > 1` it is a leftover prime factor larger than the square root — apply the same seen/record step to it. Forgetting this misses numbers like `26 = 2 * 13`.
7. Finally, check every index shares a root with index `0`; return that.

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

Union-find components are closed under transitivity, which is exactly the relation "some path exists", so the answer is just "is there one component" — and traversal between every pair is possible precisely when all indices are connected. Linking each index only to the *first* index carrying each prime is enough: all indices containing `p` get chained to that same representative, so they are mutually connected without materialising the O(n²) edges. Trial division up to the square root, with the leftover handled explicitly, finds every prime factor, so no edge is missed. Factorising each of `n` numbers costs O(sqrt(M)) for `M` the maximum value, and the near-constant union-find operations do not add to it; the map holds at most one entry per distinct prime, and each number has at most `log M` of them, so space is O(n log M).
