---
# Top K Frequent Elements · Medium · Arrays & Hashing
# https://leetcode.com/problems/top-k-frequent-elements/
draft: false
pattern: "Bucket sort by frequency"
time: "O(n)"
space: "O(n)"
---

## Description

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements,
in any order. The answer is guaranteed to be unique.

**Example**

```
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
```

`1` occurs three times and `2` occurs twice, so they are the two most frequent values.

## Intuition

A value's frequency is an integer from `1` through `n`. Use the frequency as an array index
instead of sorting the distinct values. Scanning those buckets from high to low visits values in
non-increasing frequency order.

## Approach

1. Count every value in a hash map.
2. Allocate `n + 1` buckets so frequency `n` is a valid index.
3. Append each distinct value to the bucket matching its frequency.
4. Scan frequencies from `n` down to `1`, appending bucket contents to `result`.
5. Return as soon as `k` values have been collected; their order is unrestricted.

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

After bucketing, the invariant is that bucket `f` contains exactly the values occurring `f`
times. During the descending scan, every collected value is at least as frequent as every value
in an unvisited bucket. Consequently, when `k` values have been collected, no omitted value can
have a greater frequency, so the result is exactly a valid top-`k` set.

**Complexity**

- **Time:** `O(n)` for counting, bucketing, and scanning.
- **Space:** `O(n)` for the frequency map, buckets, and result.
