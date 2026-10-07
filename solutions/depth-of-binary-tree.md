---
# Maximum Depth of Binary Tree · Easy · Trees
# https://leetcode.com/problems/maximum-depth-of-binary-tree/
draft: false
pattern: "Post-order height recursion"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree, return its maximum depth: the number of nodes on its longest path
from the root to a leaf.

**Example**

```
Input: root = [3,9,20,null,null,15,7]
Output: 3
```

The paths through nodes 15 and 7 each contain three nodes, so the maximum depth is 3.

## Intuition

Every root-to-leaf path enters either the left or right subtree after visiting the root.
Therefore, a subtree's depth is one plus the larger child depth. Returning zero for an
empty subtree makes the recurrence handle leaves without a separate case.

## Approach

1. Return `0` when `root` is `None`.
2. Recursively compute the depths of `root.left` and `root.right`.
3. Return `1 + max(left_depth, right_depth)`; the one counts the current node. No tree
   pointers or values are mutated.

## Code

```python
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```

## Why it works

By induction on tree height, the empty tree has the correct depth zero. Assume both child
calls return their true maximum depths. Every path from the current node continues through
exactly one child, so the longest path contains the current node plus the larger child
depth. The returned recurrence is therefore correct for the current subtree and, by
induction, for the full tree.

**Complexity**

- **Time:** `O(n)` because each node is visited once.
- **Space:** `O(h)` for recursion, where `h` is the tree height and can equal `n`.
