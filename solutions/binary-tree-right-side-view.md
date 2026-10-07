---
# Binary Tree Right Side View · Medium · Trees
# https://leetcode.com/problems/binary-tree-right-side-view/
draft: false
pattern: "BFS taking last node of each level"
time: "O(n)"
space: "O(n)"
---

## Description

Given a binary tree, return the rightmost node value at each depth, from top to bottom.

**Example**

```
Input: root = [1,2,3,null,5,null,4]
Output: [1,3,4]
```

The rightmost values at depths zero, one, and two are `1`, `3`, and `4`.

## Intuition

The visible node is the rightmost node at each level, not necessarily part of a chain of right
children. Breadth-first search processes one complete level at a time. If children are enqueued
left to right, the final node removed from each level is the visible one.

## Approach

1. Return `[]` for an empty tree; otherwise enqueue the root.
2. At each BFS round, save `n = len(queue)`, the number of nodes in the current level.
3. Remove exactly `n` nodes from left to right. Append the final node's value to `res`.
4. Enqueue each node's left child before its right child to preserve order on the next level.
5. Return one collected value per level.

## Code

```python
import collections

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        res = []
        queue = collections.deque([root])
        while queue:
            n = len(queue)
            for i in range(n):
                node = queue.popleft()
                if i == n - 1:
                    res.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        return res
```

## Why it works

At the start of each round, the queue contains exactly one level in left-to-right order. Removing
the saved number of nodes therefore makes the final removal the level's rightmost node. Enqueuing
children left first establishes the same invariant for the next round. Thus exactly the visible
node at every depth is recorded.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(w)` auxiliary queue space, where `w` is the tree's maximum width, plus `O(h)`
  output space.
