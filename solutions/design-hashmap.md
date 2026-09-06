---
# Design HashMap · Easy · Arrays & Hashing
# https://leetcode.com/problems/design-hashmap/
draft: false
pattern: "Bucket array with chaining"
time: "O(1) average per op"
space: "O(n + k)"
---

## Intuition

Same skeleton as Design HashSet — a fixed array of `k` buckets, `key % k` to choose one,
chaining for collisions — except each chain entry is a `(key, value)` pair instead of a
bare key. The one new wrinkle is that `put` has two jobs: overwrite if the key is already
in the chain, append if it isn't. Getting that wrong gives you a map with two entries for
the same key, where `get` returns whichever is found first.

## Approach

1. `__init__`: `self.size = 1009` (prime, to scatter keys that share factors) and
   `self.buckets = [[] for _ in range(self.size)]` — a comprehension, so the buckets are
   distinct lists.
2. The bucket for a key is always `self.buckets[key % self.size]`.
3. `put(key, value)`: scan the bucket with `enumerate`; if some entry has a matching key,
   replace that slot with `(key, value)` and return. If the scan finishes, append the pair.
4. `get(key)`: scan the bucket and return `v` on a key match; return `-1` if the chain ends
   without one — `-1` is the problem's "not found" sentinel.
5. `remove(key)`: scan the bucket for the index of the matching key, `pop(i)`, return.
   A missing key is a no-op, not an error.
6. Every method touches exactly one bucket, so the three scans are all short.

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

Because `key % size` depends only on the key, every operation on a key is confined to one
bucket, so scanning that chain is the same as scanning the whole map. `put`'s
overwrite-or-append keeps the invariant that a key appears at most once in its chain,
which is what lets `get` return on the first match and `remove` stop after one `pop`.
Chains average `n / k` entries for `n` stored keys, giving `O(1)` average time per
operation and `O(n + k)` space.
