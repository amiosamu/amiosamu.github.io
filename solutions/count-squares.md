---
# Detect Squares · Medium · Math & Geometry
# https://leetcode.com/problems/detect-squares/
draft: false
pattern: "Hash maps: column buckets + corner counting"
time: "O(1) per add, O(n) per count"
space: "O(n)"
---

## Intuition

Brute force would store every point and, on each `count` query, scan all pairs looking for
two more points that close off an axis-aligned square - too slow and awkward once duplicate
points are allowed. The fix: an axis-aligned square is pinned down by any point sharing the
query's x-coordinate (a candidate corner in the same column) - once I pick that second corner,
the side length and the other column are fixed, so the remaining two corners are just lookups.
Counting duplicates matters here since two points sitting on the exact same coordinate each
close off their own square.

## Approach

1. Maintain `points`, a `Counter` keyed by `(x, y)` tuples, tracking how many times each exact
   coordinate has been added.
2. Maintain `col`, a dict mapping `x -> Counter of y values`, so I can enumerate every distinct
   point sharing a column with a query point without scanning everything.
3. `add(point)`: unpack `x, y`; increment `points[(x, y)]` and `col[x][y]`.
4. `count(point)`: unpack `x, y` from the query point; if `x` isn't a key in `col`, return 0.
5. For every other `y3` in `col[x]` (skip `y3 == y`), let `d = y3 - y` - this fixes the square's
   side length to `|d|`, with the query point and `(x, y3)` forming one vertical edge.
6. For each candidate opposite column `x3` in `(x + d, x - d)`, the two remaining corners must
   sit at `(x3, y)` and `(x3, y3)`; add `cnt3 * points[(x3, y)] * points[(x3, y3)]` to the
   running total, where `cnt3 = col[x][y3]` is how many duplicates sit at `(x, y3)`.
7. Sum contributions over every `y3` and both choices of `x3`, and return the total.

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

For any axis-aligned square, the query point plus any other point in its column fixes one
vertical edge, and squares are rigid - that pins the edge length to `|d|` and forces the other
two corners to lie at exactly `x ± d` on rows `y` and `y3`, with no other placement possible.
Multiplying the counts at those three other corners together counts every combination of
duplicate points as a distinct square, and checking both `x + d` and `x - d` covers squares on
either side of the shared column. `count` only touches points sharing the query's column, so
it's `O(k)` for `k` such points rather than scanning every point added.
