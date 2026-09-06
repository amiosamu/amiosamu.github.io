---
# Time Based Key Value Store · Medium · Binary Search
# https://leetcode.com/problems/time-based-key-value-store/
draft: false
pattern: "Upper bound over per-key history"
time: "O(1) set, O(log n) get"
space: "O(n)"
---

## Description

Design a time-based key-value store `TimeMap` that supports `set(key, value, timestamp)`, storing `value` for `key` at the given timestamp (timestamps for a given key are guaranteed to strictly increase across calls), and `get(key, timestamp)`, which returns the value stored for `key` at the largest recorded timestamp that is less than or equal to the given timestamp, or `""` if no such timestamp exists.

**Example**

```
Input: ["TimeMap", "set", "get", "get", "set", "get", "get"], [[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
Output: [null, null, "bar", "bar", null, "bar2", "bar2"]
```

Explanation: `get("foo", 3)` still returns `"bar"` because the only recorded timestamp for `"foo"` at or before 3 is 1; once `"bar2"` is set at timestamp 4, both `get("foo", 4)` and `get("foo", 5)` return `"bar2"`, the latest value at or before their timestamps.

## Intuition

The one fact that makes this easy is buried in the constraints: `set` is called with strictly increasing timestamps for each key. So the list of `(timestamp, value)` pairs I append per key is already sorted — no sorting, no balanced tree, just a plain list. `get` is then "find the last entry whose timestamp is `<= t`", which is the boundary of the monotone predicate `entry.timestamp <= t`, i.e. the same lower-bound loop as Search Insert Position read off the other side.

## Approach

1. State: `self.store`, a `collections.defaultdict(list)` mapping key to a list of `(timestamp, value)` tuples in increasing timestamp order.
2. `set(key, value, timestamp)`: append `(timestamp, value)` to `self.store[key]`. `O(1)` amortised, and the list stays sorted for free because timestamps arrive increasing.
3. `get(key, timestamp)`: bind `entries = self.store[key]`. A missing key yields an empty list from the defaultdict, which the loop handles without a special case.
4. Search space: the index interval `[l, r]` into `entries`, **inclusive on both ends**, with `l = 0`, `r = len(entries) - 1`. An empty history starts as `[0, -1]`, already empty.
5. Monotone predicate: `P(i) = entries[i][0] <= timestamp`. Sorted timestamps make it true on a prefix and false after; the answer is the *last* true index.
6. Invariant: every index `< l` satisfies `P`, every index `> r` fails it.
7. Loop `while l <= r`, `mid = (l + r) // 2`. If `entries[mid][0] <= timestamp`, that entry is a candidate and later ones might be better: `l = mid + 1`. Otherwise it is too new: `r = mid - 1`.
8. On exit `l == r + 1`, so `r` is the last entry at or before `timestamp` and `l` the first strictly after. Return `entries[r][1]` if `r >= 0`, else `""` — `r == -1` covers both "no such key" and "every stored timestamp is too new".

## Code

```python
import collections

class TimeMap:
    def __init__(self):
        self.store = collections.defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self.store[key]
        l, r = 0, len(entries) - 1
        while l <= r:
            mid = (l + r) // 2
            if entries[mid][0] <= timestamp:
                l = mid + 1
            else:
                r = mid - 1
        return entries[r][1] if r >= 0 else ""
```

## Why it works

Appending in call order keeps each key's list sorted by timestamp, which is what licenses the binary search; the predicate `timestamp_i <= t` therefore flips from true to false exactly once, and the loop invariant makes `r` the index of that last true entry when the interval empties. That entry is by definition the largest timestamp not exceeding `t`, which is what `get` is specified to return. `set` is `O(1)`, `get` is `O(log n)` in the number of entries for that key, and the store holds `O(n)` pairs across all `set` calls.
