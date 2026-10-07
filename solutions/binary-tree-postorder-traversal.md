---
# Binary Tree Postorder Traversal · Easy · Trees
# https://leetcode.com/problems/binary-tree-postorder-traversal/
draft: false
pattern: "Reversed pre-order with a stack"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree, return its values in left-subtree, right-subtree, node order.

**Example**

```
Input: root = [1,null,2,3]
Output: [3,2,1]
```

The subtree rooted at `2` produces `[3,2]`, and the root `1` is visited last.

## Intuition

It is simple to generate reverse postorder: visit each node before its right subtree and then its
left subtree. Reversing that `node-right-left` sequence gives `left-right-node`, including the
correct internal order within every subtree.

## Approach

1. Return an empty list for an empty tree; otherwise initialize `stack = [root]` and `res = []`.
2. Pop a node, append its value, then push its left child followed by its right child.
3. Because the right child is popped first, `res` is produced in node-right-left order.
4. Reverse `res` in place and return it to obtain left-right-node postorder without allocating
   another result list.

## Code

```python
class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        res = []
        stack = [root]
        while stack:
            node = stack.pop()
            res.append(node.val)
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
        res.reverse()
        return res
```

## Why it works

The loop invariant is that popping the stack next produces the reverse-postorder sequence. After
a node, pushing left and then right schedules the right subtree before the left, preserving
node-right-left order recursively. Reversing the completed sequence reverses both subtree order
and each subtree's internal order, yielding left-right-node postorder.

**Complexity**

- **Time:** `O(n)` including the final reversal.
- **Space:** `O(h)` auxiliary stack space and `O(n)` output space. The reversal is in place.
