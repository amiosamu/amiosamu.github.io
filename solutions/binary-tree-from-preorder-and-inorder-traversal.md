---
# Construct Binary Tree From Preorder And Inorder Traversal · Medium · Trees
# https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
draft: false
pattern: "Preorder gives root, inorder splits sides"
time: "O(n)"
space: "O(n)"
---

## Description

Given the preorder and inorder traversals of a binary tree with unique values, reconstruct and
return the tree.

**Example**

```
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]
```

Preorder identifies `3` as the root. Its inorder position separates `[9]` from `[15,20,7]`,
which are the root's left and right subtrees.

## Intuition

Preorder visits each subtree's root first. Inorder places that root between all values in its left
and right subtrees. A cursor consumes roots from preorder, while an index map splits each inorder
range in constant time. Passing bounds avoids repeated array slicing.

## Approach

1. Map each unique value to its index in `inorder`, and initialize preorder cursor `pre = 0`.
2. Let `build(lo, hi)` construct the subtree represented by the inclusive inorder range. Return
   `None` when the range is empty.
3. Create the root from `preorder[pre]`, advance `pre`, and find its split index `mid`.
4. Build `[lo, mid - 1]` before `[mid + 1, hi]`. This left-first order matches preorder's
   root-left-right sequence.
5. Return the root built for the full inorder range. Empty traversals produce `None`.

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

By induction on the inorder range length, `build(lo, hi)` returns the unique corresponding
subtree. The first unconsumed preorder value is its root, and the root's inorder index partitions
the remaining values into its left and right subtrees. The recursive calls construct those
smaller ranges in preorder order, completing the same subtree.

**Complexity**

- **Time:** `O(n)` because each node is created once and each index lookup is constant time.
- **Space:** `O(n)` for the index map and up to `O(h)` recursion depth; the returned tree uses
  `O(n)` space.
