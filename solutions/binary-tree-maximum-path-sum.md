---
# Binary Tree Maximum Path Sum · Hard · Trees
# https://leetcode.com/problems/binary-tree-maximum-path-sum/
draft: false
pattern: "Post-order gain down, global best through"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree, return the maximum sum of any non-empty path. A path follows edges, uses
each node at most once, and does not need to pass through the root.

**Example**

```
Input: root = [1,2,3]
Output: 6
```

Explanation: the best path is `2 -> 1 -> 3`, giving `2 + 1 + 3 == 6`.

## Intuition

Every path has a highest node. The best path with a given highest node may use one downward branch
from each child. In contrast, a path offered to the parent may use only one child branch, or it
would fork. Negative branch gains can be omitted, so they are clamped to zero.

## Approach

1. Initialize global `best` to negative infinity so an all-negative tree is handled correctly.
2. Define `gain(node)` as the maximum sum of a path starting at `node` and descending through
   at most one child. An empty subtree contributes zero.
3. Compute each child gain and replace negative gains with zero.
4. Update `best` with `node.val + left + right`, the best path whose highest node is `node`.
5. Return `node.val + max(left, right)` to the parent, then return `best` after the traversal.

## Code

```python
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        best = float('-inf')

        def gain(node):
            nonlocal best
            if not node:
                return 0
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)
            best = max(best, node.val + left + right)
            return node.val + max(left, right)

        gain(root)
        return best
```

## Why it works

Every non-empty path has one highest node and consists of at most one downward chain in each of
that node's child subtrees. The candidate computed there therefore includes every possible path.
Dropping a negative branch cannot reduce the optimum, and `best` starts below every valid
single-node path. Taking the maximum of all candidates yields the maximum path sum.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(h)` for recursion.
