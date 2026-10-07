---
# Binary Tree Inorder Traversal · Easy · Trees
# https://leetcode.com/problems/binary-tree-inorder-traversal/
draft: false
pattern: "Iterative inorder with explicit stack"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree, return its values in left-subtree, node, right-subtree order.

**Example**

```
Input: root = [1,null,2,3]
Output: [1,3,2]
```

Node `1` is visited first, followed by `3`, the left child of `2`, and then `2`.

## Intuition

An explicit stack can reproduce the recursive traversal. Descending left postpones each ancestor
on the stack. Once no left child remains, the top node is ready to visit; its right child then
starts the same process for the next subtree.

## Approach

1. Keep output `res`, ancestor `stack`, and current node `cur = root`.
2. While work remains, push the entire left path from `cur` onto the stack.
3. Pop the nearest unvisited ancestor, append its value, and set `cur` to its right child.
4. Return `res`. For an empty tree, both loop conditions are false immediately.

## Code

```python
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        res = []
        stack = []
        cur = root
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            res.append(cur.val)
            cur = cur.right
        return res
```

## Why it works

The stack contains ancestors whose left subtrees have been entered but whose own values have not
yet been emitted. Reaching `None` proves the top node's left subtree is complete, so popping and
visiting it is the next inorder action. Moving to its right child restores the invariant for the
remaining traversal.

**Complexity**

- **Time:** `O(n)` because each node is pushed and popped once.
- **Space:** `O(h)` auxiliary stack space and `O(n)` output space.
