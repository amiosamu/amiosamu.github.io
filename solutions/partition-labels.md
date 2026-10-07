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

Explanation: The first part contains every `a`, `b`, and `c`; the next two parts similarly contain
all occurrences of their letters, producing lengths `9`, `7`, and `8`.

## Intuition

A part cannot end before the final occurrence of any character it contains. While scanning a
candidate part, track the farthest last occurrence of all characters seen. The first index that
reaches this boundary is the earliest legal cut, and taking every earliest cut maximizes the
number of parts.

## Approach

1. Build `last`, mapping each character to its final index.
2. Track `start` and `end` for the current part while scanning `s`.
3. At each character, extend `end` to `max(end, last[c])`.
4. When `i == end`, append the part length and move `start` to `i + 1`.
5. Return the collected lengths. The string is not mutated.

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

During a part, `end` is the greatest final occurrence of every character encountered so far. If
`i < end`, at least one encountered character appears later, so no valid partition can cut at `i`.
When `i == end`, none of the part's characters appears afterward, making the cut valid. Therefore,
the algorithm chooses the earliest possible end for each part. Any valid partition must end its
corresponding part no earlier, so induction over parts proves this greedy choice maximizes their
number.

**Complexity**

- **Time:** `O(n)` for two passes over `s`.
- **Space:** `O(1)` auxiliary space for the fixed lowercase alphabet, plus `O(n)` output space in
  the worst case.
