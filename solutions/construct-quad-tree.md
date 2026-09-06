---
# Construct Quad Tree · Medium · Trees
# https://leetcode.com/problems/construct-quad-tree/
draft: false
pattern: "Divide grid into quadrants, merge uniform leaves"
time: "O(n^2)"
space: "O(log n)"
---

## Description

Given an n x n grid of 0s and 1s, where n is a power of two, build the equivalent quad-tree: recursively split the grid into four equal quadrants, representing any quadrant whose cells are all the same value as a single leaf node holding that value, and splitting a mixed quadrant into four further quadrants otherwise.

**Example**

```
Input: grid = [[0,1],[1,0]]
Output: Node(val=True, isLeaf=False, topLeft=Node(0,True), topRight=Node(1,True), bottomLeft=Node(1,True), bottomRight=Node(0,True))
```

Explanation: The four cells 0, 1, 1, 0 are not all equal, so the root cannot collapse into one leaf; each 1x1 quadrant is trivially uniform, so topLeft, topRight, bottomLeft, and bottomRight each become a leaf carrying their own cell's value.

## Intuition

The obvious version scans a whole sub-grid to ask "is it all the same value?", and if it isn't, splits into four and repeats — that re-reads every cell at every level, O(n² log n). But the question "is this square uniform?" is answerable from the children instead of from the cells: a square is uniform exactly when all four quadrants came back as leaves carrying the same value. So I build bottom-up, and the merge test is four field reads instead of a scan.

## Approach

1. `grid` is n × n with n a power of two, so every quadrant is again a square of even size until size 1.
2. Write `build(r, c, size)` returning the quad-tree `Node` for the square whose top-left corner is `(r, c)`.
3. Base case `size == 1`: return a leaf, `Node(grid[r][c] == 1, True, None, None, None, None)`. LeetCode's `Node` constructor takes all six arguments with no defaults — `val, isLeaf, topLeft, topRight, bottomLeft, bottomRight` — so the four Nones must be passed explicitly.
4. Otherwise `half = size // 2`, and recurse in the order the constructor wants them: `tl = build(r, c, half)`, `tr = build(r, c + half, half)`, `bl = build(r + half, c, half)`, `br = build(r + half, c + half, half)`. Getting these four offsets right is the only fiddly part: the column shifts for the right pair, the row shifts for the bottom pair.
5. Merge test: if all four are leaves **and** their `val` fields are all equal, the whole square is uniform — throw the four children away and return a single leaf `Node(tl.val, True, None, None, None, None)`.
6. Otherwise return an internal node `Node(True, False, tl, tr, bl, br)`. `val` is ignored for internal nodes, so `True` is just the conventional filler.
7. Return `build(0, 0, len(grid))`.

## Code

```python
class Solution:
    def construct(self, grid: List[List[int]]) -> 'Node':
        def build(r, c, size):
            if size == 1:
                return Node(grid[r][c] == 1, True, None, None, None, None)
            half = size // 2
            tl = build(r, c, half)
            tr = build(r, c + half, half)
            bl = build(r + half, c, half)
            br = build(r + half, c + half, half)
            if (tl.isLeaf and tr.isLeaf and bl.isLeaf and br.isLeaf
                    and tl.val == tr.val == bl.val == br.val):
                return Node(tl.val, True, None, None, None, None)
            return Node(True, False, tl, tr, bl, br)

        return build(0, 0, len(grid))
```

## Why it works

By induction, `build` returns a leaf for a square exactly when that square is uniform: true at size 1, and at larger sizes a square is uniform iff all four quadrants are uniform with the same value, which is precisely the merge test on already-correct children. Non-uniform squares therefore keep all four children, matching the problem's rule that you only stop splitting when the cells agree. The recursion makes 1 + 4 + 16 + … + n² = O(n²) calls, each doing O(1) work outside the recursion, so it is O(n²) — one constant-time visit per cell rather than a rescan — with recursion depth log n and hence O(log n) auxiliary space beyond the returned tree.
