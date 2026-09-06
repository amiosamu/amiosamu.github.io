---
# Partition Labels · Medium · Greedy
# https://leetcode.com/problems/partition-labels/
draft: false
pattern: "Greedy over last-occurrence index"
time: "O(n)"
space: "O(1)"
---

## Description

Given a string `s`, split it into as many parts as possible such that each letter appears in at
most one part, and return a list of the sizes of these parts in order.

**Example**

```
Input: s = "ababcbacadefegdehijhklij"
Output: [9,7,8]
```

Explanation: The first 9 characters, `"ababcbaca"`, contain every occurrence of `'a'`, `'b'`, and
`'c'` in the whole string, so the partition can close there; the next 7 and the final 8 characters
split the same way, giving parts of size `9, 7, 8`.

## Intuition

A partition can only close at index `i` if no character it contains reappears after `i` — that
is, every character seen since the partition started must have its last occurrence at or before
`i`. So precomputing the last index of every character turns "can I cut here" into "has the
running max of last-occurrences, over characters seen so far in this partition, caught up to my
current position." Cutting the instant that happens is always safe and never merges two
partitions that could have stayed separate.

## Approach

1. Build `last`, a dict mapping each character to its last index in `s`
   (`last = {c: i for i, c in enumerate(s)}` — later indices overwrite earlier ones, so the
   final value for each key is its true last occurrence).
2. Initialize `sizes = []`, `start = 0` (start of the current partition), `end = 0` (furthest
   index the current partition must reach).
3. Loop `i, c` over `enumerate(s)`: set `end = max(end, last[c])`, extending the boundary to
   cover `c`'s last occurrence.
4. If `i == end`: every character seen since `start` has its last occurrence at or before `i`,
   so it's safe to close here. Append `end - start + 1` to `sizes`, then set `start = i + 1`.
5. After the loop, return `sizes`.

## Code

```python
class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        last = {c: i for i, c in enumerate(s)}

        sizes = []
        start = end = 0

        for i, c in enumerate(s):
            end = max(end, last[c])
            if i == end:
                sizes.append(end - start + 1)
                start = i + 1

        return sizes
```

## Why it works

`end` is maintained as the rightmost last-occurrence among characters seen since `start`, so
`i == end` is exactly the condition that no character in `[start, i]` can reappear later —
extending the partition even one more index would only ever be forced by a character whose last
occurrence lies beyond `i`, and `end` already accounts for every such character seen so far.
Since any valid partitioning must respect these same last-occurrence constraints, cutting the
moment it becomes possible can never merge two partitions that a different valid split would
have kept apart, which is what maximizes the count. One pass to build `last` and one pass to
scan give O(n) time; `last` holds at most one entry per distinct character, O(1) here since the
alphabet is fixed.
