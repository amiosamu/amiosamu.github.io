---
# Top K Frequent Elements · Medium · Arrays & Hashing
# https://leetcode.com/problems/top-k-frequent-elements/
draft: false
pattern: "Bucket sort by frequency"
time: "O(n)"
space: "O(n)"
---

## Intuition

Counting is the easy half; the question is how to get the `k` largest counts
without sorting them. The problem explicitly asks for better than `O(n log n)`,
which rules out `sorted(count, key=count.get)` and makes even the `O(n log k)`
heap answer a compromise.

The observation that kills the sort: a frequency is itself a small integer,
bounded by `n`. So I can index by it. Build `n + 1` buckets, drop each value into
`buckets[its frequency]`, then walk the buckets from the back — that is a counting
sort on a key I already know the range of, and it costs `O(n)`.

## Approach

1. Build `count`, a dict from value to how many times it occurs, in one pass.
2. Allocate `buckets = [[] for _ in range(len(nums) + 1)]`. Index `f` holds every
   value that occurs exactly `f` times; index `0` stays empty.
3. For each `value, freq` in `count`, append `value` to `buckets[freq]`.
4. Walk `freq` from `len(nums)` down to `1`, and inside each bucket append every
   value to `result`.
5. Return as soon as `len(result) == k` — the problem guarantees the answer is
   unique, so ties never need breaking.
6. Size the bucket list `len(nums) + 1`, not `len(nums)`: a single value repeated
   `n` times needs index `n` to exist.

## Code

```python
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = {}
        for x in nums:
            count[x] = count.get(x, 0) + 1

        buckets = [[] for _ in range(len(nums) + 1)]
        for value, freq in count.items():
            buckets[freq].append(value)

        result = []
        for freq in range(len(nums), 0, -1):
            for value in buckets[freq]:
                result.append(value)
                if len(result) == k:
                    return result

        return result
```

## Why it works

Scanning buckets from high index to low visits values in non-increasing frequency
order, so the first `k` values collected are exactly the `k` most frequent. Every
step is linear: one pass to count, one pass over the distinct values to bucket
them, and one sweep over `n + 1` buckets whose contents total the number of
distinct values — `O(n)` overall, with `O(n)` space for the count map and buckets.
