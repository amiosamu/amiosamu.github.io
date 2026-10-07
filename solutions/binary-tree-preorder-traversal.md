---
# Binary Tree Preorder Traversal · Easy · Trees
# https://leetcode.com/problems/binary-tree-preorder-traversal/
draft: false
pattern: "Iterative preorder with explicit stack"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree, return its values in node, left-subtree, right-subtree order.

**Example**

```
Input: root = [1,null,2,3]
Output: [1,2,3]
```

The traversal visits root `1`, then `2`, and finally `2`'s left child `3`.

## Intuition

A stack can hold subtree roots that remain to be visited. Preorder emits a node immediately, then
processes its left subtree before its right. Because a stack is last-in, first-out, pushing the
right child before the left child produces that order.

## Approach

1. Return `[]` for an empty tree; otherwise start `stack = [root]` and `res = []`.
2. Pop a node and append its value immediately.
3. Push its right child and then its left child when present, so the left child is processed next.
4. Continue until no subtree roots remain, then return `res`.

## Code

```python
class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        res = []
        stack = [root]
        while stack:
            node = stack.pop()
            res.append(node.val)
            if node.right:
                stack.append(node.right)
            if node.left:
                stack.append(node.left)
        return res
```

## Why it works

Read from top to bottom, the stack contains the roots of unvisited subtrees in preorder. Popping a
root emits the next required node; placing its left subtree ahead of its right subtree preserves
the same invariant. By induction on the number of pops, `res` is exactly the preorder prefix, and
the complete result is correct when the stack empties.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(h)` auxiliary stack space and `O(n)` output space.
