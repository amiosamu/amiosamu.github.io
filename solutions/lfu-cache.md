---
# LFU Cache · Hard · Linked List
# https://leetcode.com/problems/lfu-cache/
draft: false
pattern: "Frequency buckets of ordered keys"
time: "O(1)"
space: "O(capacity)"
---

## Intuition

LFU is LRU with a second dimension: evict the least-used key, and break ties by least-recently
used. Scanning for the minimum frequency is O(n), so bucket the keys by frequency and keep each
bucket in access order — then eviction is "pop the front of the lowest non-empty bucket". The
part that makes it O(1) is the observation that a frequency only ever increases by exactly one,
so when the current minimum bucket empties out because its last key was promoted, the new
minimum is `minfreq + 1` and nothing has to be searched.

## Approach

1. State: `self.vals` (key -> value), `self.freq` (key -> use count), `self.buckets` (count ->
   `collections.OrderedDict` used as an ordered set of keys, oldest first), and `self.minfreq`.
2. `_bump(key)` — the shared promotion helper, in this order:
   `f = self.freq[key]`; `del self.buckets[f][key]`; if that bucket is now empty,
   `del self.buckets[f]` and, if `self.minfreq == f`, set `self.minfreq = f + 1`;
   then `self.freq[key] = f + 1` and `self.buckets[f + 1][key] = None`.
   Re-inserting into the new bucket puts the key at the *back*, which is exactly the recency
   order the tie-break needs.
3. `get(key)`: return `-1` on a miss. Otherwise `_bump(key)` and return `self.vals[key]`. A read
   is a use.
4. `put(key, value)`: return immediately if `self.cap == 0` — a zero-capacity cache stores
   nothing, and without this guard the eviction branch would pop from an empty bucket.
5. If the key is already present, overwrite `self.vals[key]`, `_bump(key)` and return. An update
   is a use, but it is not an insertion, so no eviction can happen.
6. Otherwise, if `len(self.vals) == self.cap`, evict first:
   `evict, _ = self.buckets[self.minfreq].popitem(last=False)` takes the oldest key in the
   lowest bucket; drop the bucket if it is now empty, then `del self.vals[evict]` and
   `del self.freq[evict]`.
7. Insert the new key with `self.vals[key] = value`, `self.freq[key] = 1`,
   `self.buckets[1][key] = None`, and `self.minfreq = 1`. Resetting `minfreq` to 1 here is
   mandatory — a brand-new key is always the least frequently used.

## Code

```python
import collections

class LFUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.vals = {}
        self.freq = {}
        self.buckets = collections.defaultdict(collections.OrderedDict)
        self.minfreq = 0

    def _bump(self, key: int) -> None:
        f = self.freq[key]
        del self.buckets[f][key]
        if not self.buckets[f]:
            del self.buckets[f]
            if self.minfreq == f:
                self.minfreq = f + 1
        self.freq[key] = f + 1
        self.buckets[f + 1][key] = None

    def get(self, key: int) -> int:
        if key not in self.vals:
            return -1
        self._bump(key)
        return self.vals[key]

    def put(self, key: int, value: int) -> None:
        if self.cap == 0:
            return
        if key in self.vals:
            self.vals[key] = value
            self._bump(key)
            return
        if len(self.vals) == self.cap:
            evict, _ = self.buckets[self.minfreq].popitem(last=False)
            if not self.buckets[self.minfreq]:
                del self.buckets[self.minfreq]
            del self.vals[evict]
            del self.freq[evict]
        self.vals[key] = value
        self.freq[key] = 1
        self.buckets[1][key] = None
        self.minfreq = 1
```

## Why it works

The invariant is that `buckets[f]` contains exactly the live keys whose use count is `f`, in
increasing order of last access, and `minfreq` is the smallest `f` with a non-empty bucket — so
`popitem(last=False)` on `buckets[minfreq]` returns precisely the least frequently used key,
oldest first among ties, which is the eviction rule verbatim. `minfreq` stays correct because
the only two events that can invalidate it are an insertion (which creates a key at frequency 1,
handled by setting it to 1) and a promotion that empties the current minimum bucket (whose key
moved to `f + 1`, so `f + 1` is now non-empty and minimal). Every operation is a fixed number of
dict and `OrderedDict` operations, all O(1), and the structures together hold one entry per live
key, so O(capacity) space.
