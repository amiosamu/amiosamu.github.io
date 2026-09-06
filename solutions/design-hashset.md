---
# Design HashSet · Easy · Arrays & Hashing
# https://leetcode.com/problems/design-hashset/
draft: false
pattern: "Bucket array with chaining"
time: "O(1) average per op"
space: "O(n + k)"
---

## Description

Design a HashSet without using any built-in hash table library, supporting `add(key)`
(insert a non-negative integer key), `remove(key)` (delete it if present), and
`contains(key)` (report whether it's currently stored).

**Example**

```
Input: ["MyHashSet", "add", "add", "contains", "contains", "add", "contains", "remove", "contains"], [[], [1], [2], [1], [3], [2], [2], [2], [2]]
Output: [null, null, null, true, false, null, true, null, false]
```

Explanation: After `add(1)` and `add(2)`, `contains(1)` is `true` and `contains(3)` is
`false`; adding `2` again changes nothing; after `remove(2)`, `contains(2)` flips back to
`false`.

## Intuition

Keys go up to `10^6`, so a plain boolean array of that size actually works — but it's not
what the problem is asking for. The real structure is a fixed array of `k` buckets plus a
hash that maps a key to a bucket: `key % k`. Collisions are handled by chaining, i.e. each
bucket is a small list scanned linearly. Picking `k` prime (1009 here) keeps keys with
common factors — a very likely pattern in test input — from piling into the same bucket.

## Approach

1. In `__init__`, fix `self.size = 1009` (prime) and build `self.buckets` as a list of
   `size` empty lists. Build them with a comprehension, never `[[]] * size`, which would
   alias one list into every slot.
2. Define the bucket of a key as `self.buckets[key % self.size]`.
3. `add(key)`: get the bucket; append only if `key not in bucket`, so the set stays free
   of duplicates.
4. `remove(key)`: get the bucket; `bucket.remove(key)` if present, otherwise do nothing —
   removing an absent key must not raise.
5. `contains(key)`: return `key in bucket`, a linear scan of that one chain.
6. Keys are non-negative in this problem, so `%` never yields a negative index.

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

`key % size` is a function of the key alone, so a key always lands in the same bucket and
searching that one chain is equivalent to searching the whole set — that's the entire
correctness argument. `add`'s membership check keeps at most one copy per key, which is
what makes `remove` a single deletion. With `n` keys spread over `k` buckets each chain
averages `n / k` entries, so operations are `O(1)` on average (`O(n)` in the pathological
all-collide case), and space is `O(n + k)`.
