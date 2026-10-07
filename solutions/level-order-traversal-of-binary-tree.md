---
# Binary Tree Level Order Traversal · Medium · Trees
# https://leetcode.com/problems/binary-tree-level-order-traversal/
draft: false
pattern: "BFS with per-level queue snapshot"
time: "O(n)"
space: "O(n)"
---

## Description

Given a binary tree root, return node values grouped by depth from top to bottom, with each
level listed from left to right.

**Example**

```
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
```

The root forms the first level, its children form the second, and the children of `20` form
the third.

## Intuition

Breadth-first search visits nodes by increasing depth. At the start of each outer iteration, the
queue contains exactly one level. Capturing its size before adding children separates that level
from the next one without storing depths on individual nodes.

## Approach

1. Return an empty list for an empty tree; otherwise enqueue `root`.
2. At each outer iteration, create `level` and snapshot the current queue length.
3. Remove exactly that many nodes, append their values, and enqueue each left child before its
   right child.
4. Append the completed `level` to `res`; the queue now contains only the next level.
5. Return `res` after the queue is empty.

## Code

```python
import collections

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        res = []
        queue = collections.deque([root])
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            res.append(level)
        return res
```

## Why it works

Initially the queue contains exactly the depth-zero level. If it contains one complete level in
left-to-right order, removing its saved number of nodes records that level exactly once. Enqueuing
each node's left child before its right child constructs the next level in left-to-right order.
Thus the invariant holds by induction, and every list appended to `res` is the correct level.

**Complexity**

- **Time:** `O(n)`, because each node is enqueued and removed once.
- **Space:** `O(n)` auxiliary queue space in the worst case, plus `O(n)` for the output.
