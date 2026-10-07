---
# Diameter of Binary Tree · Easy · Trees
# https://leetcode.com/problems/diameter-of-binary-tree/
draft: false
pattern: "Post-order height, answer on the side"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree, return the number of edges in its longest path between two nodes. The path
does not need to pass through the root.

**Example**

```
Input: root = [1,2,3,4,5]
Output: 3
```

The path `4 -> 2 -> 1 -> 3` crosses three edges. Replacing `4` with `5` is equally long.

## Intuition

Every path has a highest node. Its two parts descend through that node's left and right subtrees,
so the best path with that highest node has length `left_height + right_height`. A postorder
traversal computes those heights once and updates the best diameter at the same time.

## Approach

1. Keep `best`, the largest edge count found, in the enclosing scope.
2. Define `height(node)` as the number of nodes on the longest downward path from `node`,
   returning zero for an empty subtree.
3. Recursively compute `left` and `right`. The best path topped by `node` has
   `left + right` edges, so use it to update `best`.
4. Return `1 + max(left, right)` because a path extending to the parent can use only one
   child branch.
5. Run the helper and return `best`. Empty and single-node trees correctly have diameter zero.

## Code

```python
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        best = 0

        def height(node: Optional[TreeNode]) -> int:
            nonlocal best
            if not node:
                return 0
            left = height(node.left)
            right = height(node.right)
            best = max(best, left + right)
            return 1 + max(left, right)

        height(root)
        return best
```

## Why it works

Every path has one unique highest node. At that node, its longest possible left and right parts
are exactly the child heights, so `left + right` considers the best path for that highest node.
The traversal evaluates every possible highest node, and `best` keeps their maximum. Returning
only one branch preserves the height contract required by the parent.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(h)` for the recursion stack.
