---
# LFU Cache · Hard · Linked List
# https://leetcode.com/problems/lfu-cache/
draft: false
pattern: "Frequency buckets of ordered keys"
time: "O(1)"
space: "O(capacity)"
---

## Description

Design a fixed-capacity cache with `get(key)` and `put(key, value)`. Reads and updates count as
uses. When insertion requires eviction, remove the least frequently used key; among equal
frequencies, remove the least recently used key.

**Example**

```
Input: ["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [4, 4], [1], [3], [4]]
Output: [null, null, null, 1, null, -1, 3, null, -1, 3, 4]
```

After `get(1)`, inserting key `3` evicts key `2`, whose frequency is lower. After `get(3)`,
keys `1` and `3` tie at frequency two, so inserting key `4` evicts the older key `1`.

## Intuition

Group keys by frequency and preserve recency order inside each group. Eviction then removes the
oldest key from the minimum-frequency group. `OrderedDict` provides constant-time deletion,
insertion at the newest end, and removal from the oldest end. A separate `minfreq` avoids scanning
the frequency groups.

## Approach

1. Store values in `vals`, each key's count in `freq`, and ordered key sets in `buckets[count]`.
   In every bucket, the first key is least recent and the last key is most recent.
2. `_bump(key)` removes the key from frequency `f`, deletes an emptied bucket, then appends the key
   to bucket `f + 1`. If the emptied bucket was `minfreq`, advance `minfreq` to `f + 1`.
3. `get` returns `-1` on a miss. On a hit it promotes the key before returning its value.
4. `put` ignores a zero-capacity cache. Updating an existing key changes its value and promotes it
   without eviction.
5. For a new key at capacity, remove the first key from `buckets[minfreq]` and delete its value and
   frequency records.
6. Insert every new key at frequency one and set `minfreq = 1`; a new key is necessarily at the
   minimum frequency.

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

The invariant is that each live key appears in exactly one `buckets[f]`, where `f` equals its
recorded frequency; keys in that bucket run from least to most recent; and `minfreq` names the
smallest non-empty bucket. Promotion removes a key from its old bucket and appends it to `f + 1`,
so membership, frequency, and recency remain synchronized. If promotion empties the minimum
bucket, `f + 1` is non-empty because it receives that key, and no lower non-empty bucket can exist.
Insertion creates frequency one and resets the minimum. Therefore eviction from the front of
`buckets[minfreq]` selects exactly the LFU key and then the LRU key among ties.

**Complexity**

- **Time:** `O(1)` average time for both `get` and `put`.
- **Space:** `O(capacity)` across all maps and frequency buckets.
