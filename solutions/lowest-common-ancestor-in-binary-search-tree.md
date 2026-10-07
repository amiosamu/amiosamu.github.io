---
# Lowest Common Ancestor of a Binary Search Tree · Medium · Trees
# https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
draft: false
pattern: "Descend until the values split"
time: "O(h)"
space: "O(1)"
---

## Description

Given a binary search tree and two nodes `p` and `q` in it, return their lowest common ancestor.
A node is considered a descendant of itself.

**Example**

```
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
```

The search paths for `2` and `8` split at `6`, making `6` their lowest common ancestor.

## Intuition

BST ordering identifies the only subtree that can contain both targets. If both values are smaller
than the current value, descend left; if both are larger, descend right.

The first node where the values split across sides, or where one equals the current value, is the
deepest node that can contain both targets.

## Approach

1. Set `cur = root`; both targets are known to lie in its subtree.
2. If both target values are less than `cur.val`, move to `cur.left`.
3. If both are greater, move to `cur.right`.
4. Otherwise, return `cur`: the values straddle it or one target is `cur` itself.

## Code

```python
class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        cur = root
        while cur:
            if p.val < cur.val and q.val < cur.val:
                cur = cur.left
            elif p.val > cur.val and q.val > cur.val:
                cur = cur.right
            else:
                return cur
        return None
```

## Why it works

The invariant is that both targets lie in `cur`'s subtree. When both values are on the same side,
the BST property puts both in that child subtree, so descending preserves the invariant and proves
the current node is not the lowest common ancestor. Otherwise, no child subtree contains both
targets, while `cur` does. Therefore `cur` is exactly their lowest common ancestor.

**Complexity**

- **Time:** `O(h)`, where `h` is the tree height.
- **Space:** `O(1)` auxiliary space because the search is iterative.
