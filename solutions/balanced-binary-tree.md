---
# Balanced Binary Tree · Easy · Trees
# https://leetcode.com/problems/balanced-binary-tree/
draft: false
pattern: "Post-order height with -1 sentinel"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree, determine whether every node's left and right subtree heights differ by at
most one.

**Example**

```
Input: root = [3,9,20,null,null,15,7]
Output: true
```

The root's subtree heights differ by one, and all other nodes also satisfy the condition.

## Intuition

A postorder traversal obtains both child heights before checking a node. Returning `-1` when a
subtree is unbalanced combines the height and validity results: valid heights are non-negative,
so the sentinel cannot be mistaken for a height and can propagate immediately to the root.

## Approach

1. Define `height(node)` to return a balanced subtree's height, or `-1` if it is unbalanced.
2. Return `0` for an empty subtree. Recursively obtain `left` and `right`, returning `-1`
   early if either child is already unbalanced.
3. Return `-1` when `abs(left - right) > 1`; otherwise return
   `1 + max(left, right)`.
4. The tree is balanced exactly when `height(root) != -1`. An empty tree correctly returns
   true.

## Code

```python
class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def height(node: Optional[TreeNode]) -> int:
            if not node:
                return 0
            left = height(node.left)
            if left == -1:
                return -1
            right = height(node.right)
            if right == -1:
                return -1
            if abs(left - right) > 1:
                return -1
            return 1 + max(left, right)

        return height(root) != -1
```

## Why it works

By induction on subtree size, `height(node)` returns the true height exactly when every node in
that subtree is balanced. The base case is empty. For a non-empty subtree, the recursive results
validate both children; the local height comparison then validates the root and computes its
height. Any failure returns `-1` through every ancestor, so the final test is correct.

**Complexity**

- **Time:** `O(n)` because each visited node performs constant work.
- **Space:** `O(h)` for the recursion stack, where `h` is the tree height.
