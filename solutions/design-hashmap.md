---
# Design HashMap · Easy · Arrays & Hashing
# https://leetcode.com/problems/design-hashmap/
draft: false
pattern: "Bucket array with chaining"
time: "O(1) average per op"
space: "O(n + k)"
---

## Description

Design a hash map without a built-in hash table. Support inserting or updating a key,
retrieving its value, and removing it. `get` returns `-1` for an absent key.

**Example**

```
Input:
operations = ["MyHashMap", "put", "put", "get", "get", "put", "get",
              "remove", "get"]
arguments = [[], [1, 1], [2, 2], [1], [3], [2, 1], [2], [2], [2]]
Output: [null, null, null, 1, -1, null, 1, null, -1]
```

`put(2, 1)` replaces the earlier value for key 2. Removing key 2 makes the following
lookup return `-1`.

## Intuition

Hash each key to one of a fixed number of buckets with `key % size`. A bucket stores a
list of `(key, value)` pairs, so distinct keys with the same hash can coexist. Every
operation scans only that chain.

The important update rule is to replace an existing pair rather than append a second
copy. This keeps each key unique and makes retrieval and removal unambiguous.

## Approach

1. Create 1009 distinct bucket lists; the prime bucket count helps distribute common
   integer patterns.
2. For every operation, select `buckets[key % size]`.
3. In `put`, replace the matching pair in place if found; otherwise append `(key, value)`.
4. In `get`, return the matching value or `-1` after the chain ends without mutating it.
5. In `remove`, pop the matching pair if present; an absent key is a no-op.

## Code

```python
class MyHashMap:
    def __init__(self):
        self.size = 1009
        self.buckets = [[] for _ in range(self.size)]

    def put(self, key: int, value: int) -> None:
        bucket = self.buckets[key % self.size]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def get(self, key: int) -> int:
        for k, v in self.buckets[key % self.size]:
            if k == key:
                return v
        return -1

    def remove(self, key: int) -> None:
        bucket = self.buckets[key % self.size]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket.pop(i)
                return
```

## Why it works

The invariant is that each stored key appears exactly once in the bucket selected by its
hash. `put` preserves this by replacing or appending, and `remove` preserves it by deleting
only the matching pair. Since the same deterministic hash chooses the bucket for `get`, a
key is found there if and only if it is present in the map.

**Complexity**

- **Time:** `O(1)` average per operation with well-distributed keys. `put`, `get`, and
  `remove` are each `O(n)` in the worst case when all keys share one bucket.
- **Space:** `O(n + k)` for `n` entries and `k = 1009` buckets.
