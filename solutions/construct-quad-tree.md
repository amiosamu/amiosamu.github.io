---
# Construct Quad Tree · Medium · Trees
# https://leetcode.com/problems/construct-quad-tree/
draft: false
pattern: "Divide grid into quadrants, merge uniform leaves"
time: "O(n^2)"
space: "O(log n)"
---

## Description

Given an `n x n` binary grid, where `n` is a power of two, build its quad tree. A uniform
square becomes one leaf; a mixed square is divided into four equal quadrants recursively.

**Example**

```
Input: grid = [[0,1],[1,0]]
Output: Node(
  val=True,
  isLeaf=False,
  topLeft=Node(0,True),
  topRight=Node(1,True),
  bottomLeft=Node(1,True),
  bottomRight=Node(0,True)
)
```

The grid is mixed, so its root is internal. Each `1 x 1` quadrant is a leaf containing that
cell's value.

## Intuition

Build from the cells upward. A larger square is uniform exactly when all four quadrant results
are leaves with the same value. This avoids rescanning each square to test uniformity and lets
the recursive results provide the answer in constant time per node.

## Approach

1. Define `build(r, c, size)` for the square with top-left cell `(r, c)`.
2. For `size == 1`, return a leaf whose value is the cell value.
3. Otherwise recursively build the top-left, top-right, bottom-left, and bottom-right squares
   of size `size // 2`.
4. If all children are leaves with one value, replace them with a leaf of that value. Otherwise
   return an internal node containing the four children. Internal-node `val` is ignored.
5. Build the full grid from `(0, 0)`. The grid is never mutated.

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

A `1 x 1` result is correctly a uniform leaf. Assume the four recursive quadrant results are
correct. Their parent square is uniform exactly when all four are uniform and share one value,
which is precisely the merge condition. Otherwise retaining them under an internal node is the
required subdivision. Induction on `size` proves the full tree correct.

**Complexity**

- **Time:** `O(n^2)`; the full recursion tree has `O(n^2)` nodes.
- **Space:** `O(log n)` auxiliary stack space and up to `O(n^2)` space for the returned tree.
