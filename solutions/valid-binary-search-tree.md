---
# Validate Binary Search Tree · Medium · Trees
# https://leetcode.com/problems/validate-binary-search-tree/
draft: false
pattern: "DFS with inherited (low, high) bounds"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary-tree root, determine whether it is a valid binary search tree. Every node must be
strictly greater than all values in its left subtree and strictly less than all values on its right.

**Example**

```
Input: root = [2,1,3]
Output: true
```

The left value is below `2`, the right value is above it, and no descendants violate either bound.

## Intuition

Parent-child comparisons miss violations against earlier ancestors. Instead, each node inherits an
open interval containing every value allowed at that position. Descending left tightens the upper
bound, while descending right tightens the lower bound.

## Approach

1. Define `valid(node, low, high)` to verify a subtree under inherited exclusive bounds.
2. Return `True` for an empty subtree.
3. Reject a node unless `low < node.val < high`; strict bounds also reject duplicates.
4. Validate the left subtree with upper bound `node.val` and the right with lower bound
   `node.val`.
5. Begin with infinite bounds because the root has no ancestor constraints.

## Code

```python
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def valid(node, low, high):
            if not node:
                return True
            if not low < node.val < high:
                return False
            return valid(node.left, low, node.val) and valid(node.right, node.val, high)

        return valid(root, float('-inf'), float('inf'))
```

## Why it works

By induction on subtree height, `valid(node, low, high)` is true exactly when the subtree is a BST
whose values all lie inside its interval. The empty case is immediate. For a nonempty tree, the
root must satisfy the interval, and the BST definition gives precisely the tightened intervals used
for its children. Requiring both recursive calls therefore proves the claim and, at infinite root
bounds, validates the whole tree.

**Complexity**

- **Time:** `O(n)` because every node is checked once.
- **Space:** `O(h)` for tree height `h`, or `O(n)` for a degenerate tree.
