---
# Detect Squares · Medium · Math & Geometry
# https://leetcode.com/problems/detect-squares/
draft: false
pattern: "Hash maps: column buckets + corner counting"
time: "O(1) per add, O(n) per count"
space: "O(n)"
---

## Description

Design a `DetectSquares` data structure that supports adding points via `add(point)` (the
same point may be added more than once) and, given a query `point`, counting via
`count(point)` how many axis-aligned squares can be formed using three previously added
points plus the query point as the fourth corner.

**Example**

```
Input:
["DetectSquares", "add", "add", "add", "count"]
[[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]]]
Output: [null, null, null, null, 1]
```

Explanation: After adding (3,10), (11,2), and (3,2), querying count([11, 10]) finds exactly
one square with those three points as the other corners, all side length 8, so it returns 1.

## Intuition

Choose an added point in the query's column as the other endpoint of a vertical side. Its
vertical distance from the query fixes the side length, leaving only two possible columns for
the square's opposite side. The other corners can then be counted by coordinate lookup.
Coordinate frequencies are necessary because repeated points create distinct choices.

## Approach

1. Store every coordinate frequency in `points`. Also group frequencies by x-coordinate in
   `col`, allowing a query to enumerate only points in its own column.
2. In `add`, increment both counters; repeated additions remain separate choices.
3. In `count`, iterate each `y3 != y` in column `x`. Let `d = y3 - y`, so the possible opposite
   columns are `x + d` and `x - d`.
4. For each opposite column `x3`, multiply the frequencies at `(x, y3)`, `(x3, y)`, and
   `(x3, y3)`. Sum these products and return the result.

## Code

```python
import collections

class DetectSquares:
    def __init__(self):
        self.points = collections.Counter()
        self.col = collections.defaultdict(collections.Counter)

    def add(self, point: List[int]) -> None:
        x, y = point
        self.points[(x, y)] += 1
        self.col[x][y] += 1

    def count(self, point: List[int]) -> int:
        x, y = point
        if x not in self.col:
            return 0
        res = 0
        for y3, cnt3 in self.col[x].items():
            if y3 == y:
                continue
            d = y3 - y
            for x3 in (x + d, x - d):
                res += cnt3 * self.points[(x3, y)] * self.points[(x3, y3)]
        return res
```

## Why it works

Every axis-aligned square containing the query has exactly one other corner in the query's
column. Choosing that corner fixes a nonzero side length and exactly two possible opposite-side
locations, both checked by the loop. Conversely, three existing points at one such location
complete a valid square. Multiplying their frequencies counts every duplicate choice exactly
once, establishing a bijection between loop contributions and squares.

**Complexity**

- **Time:** `O(1)` expected per `add`; `O(k)` per `count`, where `k` is the number of distinct
  y-coordinates stored in the query's column.
- **Space:** `O(p)` for `p` distinct added coordinates.
