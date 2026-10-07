---
# Design HashSet · Easy · Arrays & Hashing
# https://leetcode.com/problems/design-hashset/
draft: false
pattern: "Bucket array with chaining"
time: "O(1) average per op"
space: "O(n + k)"
---

## Description

Design a hash set without a built-in hash table. Support adding, removing, and testing
membership for non-negative integer keys.

**Example**

```
Input:
operations = ["MyHashSet", "add", "add", "contains", "contains", "add",
              "contains", "remove", "contains"]
arguments = [[], [1], [2], [1], [3], [2], [2], [2], [2]]
Output: [null, null, null, true, false, null, true, null, false]
```

Adding 2 twice stores only one copy. After removing it, `contains(2)` returns `false`.

## Intuition

Map each key to a fixed bucket using `key % size`. Because multiple keys can select the
same bucket, store each bucket as a list and scan that collision chain. Adding only absent
keys preserves set semantics, while removing an absent key does nothing.

## Approach

1. Allocate 1009 distinct bucket lists. A prime bucket count helps distribute patterned
   integer keys.
2. Select the same chain for every operation with `buckets[key % size]`.
3. In `add`, append only if the key is absent; this prevents duplicate entries.
4. In `remove`, mutate the chain only when the key is present. In `contains`, return the
   chain membership result without changing the set.

## Code

```python
class MyHashSet:
    def __init__(self):
        self.size = 1009
        self.buckets = [[] for _ in range(self.size)]

    def add(self, key: int) -> None:
        bucket = self.buckets[key % self.size]
        if key not in bucket:
            bucket.append(key)

    def remove(self, key: int) -> None:
        bucket = self.buckets[key % self.size]
        if key in bucket:
            bucket.remove(key)

    def contains(self, key: int) -> bool:
        return key in self.buckets[key % self.size]
```

## Why it works

The invariant is that every stored key appears exactly once in the bucket chosen by its
hash. `add` establishes or preserves that fact, and `remove` removes exactly that entry
when it exists. Since `contains` computes the same bucket, its membership test is true
exactly for stored keys.

**Complexity**

- **Time:** `O(1)` average per operation with well-distributed keys. `add`, `remove`, and
  `contains` are each `O(n)` in the worst case when all keys share one bucket.
- **Space:** `O(n + k)` for `n` keys and `k = 1009` buckets.
