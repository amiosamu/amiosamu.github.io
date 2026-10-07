---
# Time Based Key Value Store · Medium · Binary Search
# https://leetcode.com/problems/time-based-key-value-store/
draft: false
pattern: "Upper bound over per-key history"
time: "O(1) set, O(log n) get"
space: "O(n)"
---

## Description

Design `TimeMap`. `set` stores a value at a timestamp, which strictly increases for each key.
`get` returns the value at the greatest timestamp not exceeding its query, or `""` if none exists.

**Example**

```
Input: ["TimeMap", "set", "get", "get", "set", "get", "get"], [[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
Output: [null, null, "bar", "bar", null, "bar2", "bar2"]
```

The value at time `1` remains current through time `3`; the value set at time `4` is current for
queries at times `4` and `5`.

## Intuition

Strictly increasing timestamps keep each key's appended history sorted. A query is therefore an
upper-bound search: find the last history entry whose timestamp is at most the requested time.

## Approach

1. Map each key to a list of `(timestamp, value)` pairs.
2. In `set`, append the pair; the timestamp guarantee preserves sorted order.
3. In `get`, binary-search the inclusive interval `[l, r]` for the last timestamp `<=` the query.
4. Move `l` past a valid candidate, or move `r` before an entry that is too new.
5. Return `entries[r][1]` after the search, or `""` when `r == -1`.

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

For a queried history, maintain the invariant that every index below `l` is a valid candidate and
every index above `r` is too new. Sorted timestamps make this predicate monotone, so each binary
search update preserves the invariant. When the interval is empty, `r` is the last valid index;
its value is therefore the one with the greatest allowed timestamp. If `r == -1`, no valid entry
exists.

**Complexity**

- **Time:** `O(1)` amortized for `set` and `O(log k)` for `get` on a key with `k` entries.
- **Space:** `O(n)` for `n` total stored pairs.
