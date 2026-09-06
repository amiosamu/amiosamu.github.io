---
# Construct Binary Tree From Preorder And Inorder Traversal · Medium · Trees
# https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
draft: false
pattern: "Preorder gives root, inorder splits sides"
time: "O(n)"
space: "O(n)"
---

## Intuition

Two facts do all the work: pre-order starts with the root, and in-order puts everything in the left subtree *before* the root and everything in the right subtree after it. So `preorder[0]` names the root, finding it in `inorder` tells me the left subtree has exactly `mid - lo` nodes, and that count is enough to know where each side's slice of `preorder` begins. The naive version slices four lists per call, which is O(n²); instead I keep one global pointer into `preorder` and pass only index bounds into `inorder`, and I pre-hash value → in-order index so the split is O(1) instead of a scan.

## Approach

1. Build `index = {val: i for i, val in enumerate(inorder)}`. Values are unique, which is what makes this lookup well defined.
2. Keep a single cursor `pre = 0` into `preorder`, declared `nonlocal` inside the helper. Invariant: `pre` always points at the root of the subtree the current call is about to build.
3. Write `build(lo, hi)` returning the root of the subtree occupying `inorder[lo..hi]` inclusive.
4. Base case: `lo > hi`, return None — an empty range is an empty subtree, and note it consumes nothing from `preorder`.
5. Read `val = preorder[pre]`, create `root = TreeNode(val)`, look up `mid = index[val]`, then advance `pre += 1`.
6. Recurse **left first**: `root.left = build(lo, mid - 1)`, then `root.right = build(mid + 1, hi)`. The order is not optional — pre-order lays out the entire left subtree before the right one, so the left call must consume its block of `preorder` before the right call starts reading.
7. Return `root`, and kick off with `build(0, len(inorder) - 1)`.

## Code

```python
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        index = {val: i for i, val in enumerate(inorder)}
        pre = 0

        def build(lo, hi):
            nonlocal pre
            if lo > hi:
                return None
            root = TreeNode(preorder[pre])
            mid = index[preorder[pre]]
            pre += 1
            root.left = build(lo, mid - 1)
            root.right = build(mid + 1, hi)
            return root

        return build(0, len(inorder) - 1)
```

## Why it works

The in-order sequence of a subtree is (left subtree)(root)(right subtree), so splitting `inorder[lo..hi]` at the root's position separates the two sides with no ambiguity; the pre-order sequence is (root)(left subtree)(right subtree), so a left-first recursion that advances one step per node keeps `pre` aligned with the next subtree root without any slicing. Unique values are what make the split unambiguous — with duplicates the pair of traversals wouldn't determine the tree. Each node is created once with O(1) map lookups, so it's O(n) time, and space is O(n) for the map plus O(h) for the recursion.
