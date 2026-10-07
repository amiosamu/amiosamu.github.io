---
# Invert Binary Tree · Easy · Trees
# https://leetcode.com/problems/invert-binary-tree/
draft: false
pattern: "Recursive swap of children"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree, invert it so every node's left and right subtrees exchange positions.
Return the root of the mutated tree.

**Example**

```
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]
```

Explanation: Swapping the children at every node produces the mirror
`[4,7,2,9,6,3,1]`.

## Intuition

The mirror operation is recursive: swap a node's child pointers, then mirror both subtrees.
The swap does not depend on results from below, so preorder traversal is sufficient.

The nodes themselves are reused. Only child pointers change, so the input tree is mutated
in place and the root object retains its identity.

## Approach

1. Return `None` for an empty tree or missing child.
2. Swap `root.left` and `root.right` with simultaneous assignment.
3. Recursively invert the two subtrees now referenced by those pointers.
4. Return `root`. Each original node is visited once, and no new tree nodes are allocated.

## Code

```python
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = root.right, root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root
```

## Why it works

The empty tree is already its own mirror. For a nonempty tree, swapping the root's children
places the original right subtree on the left and the original left subtree on the right.
By induction on height, the recursive calls correctly mirror both of those subtrees. The
result therefore satisfies the recursive definition of the mirror at every node.

**Complexity**

- **Time:** `O(n)` because every node is visited once.
- **Space:** `O(h)` for the recursion stack, where `h` is the tree height.
