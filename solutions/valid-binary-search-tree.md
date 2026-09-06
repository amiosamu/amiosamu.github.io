---
# Validate Binary Search Tree · Medium · Trees
# https://leetcode.com/problems/validate-binary-search-tree/
draft: false
pattern: "DFS with inherited (low, high) bounds"
time: "O(n)"
space: "O(h)"
---

## Description

Given the root of a binary tree, determine whether it is a valid binary search tree: every node's value must be strictly greater than all values in its left subtree and strictly less than all values in its right subtree, not merely greater or less than its immediate children.

**Example**

```
Input: root = [2,1,3]
Output: true
```

Explanation: 1 is less than 2 and 3 is greater than 2, and neither has a subtree of its own to violate the property, so the tree is a valid BST.

## Intuition

The trap is checking `node.left.val < node.val < node.right.val` locally: that passes on `[5, 1, 6, null, null, 3, 8]`, where 3 sits legally under 6 but illegally in 5's right subtree. The BST property is global — every node in the left subtree must beat the ancestor, not just the parent. The fix is to push the constraint down: each node inherits an open interval `(low, high)` it must live in, and going left tightens `high` to the node's value while going right tightens `low`.

## Approach

1. Write `valid(node, low, high)` returning whether `node`'s subtree is a BST *and* every value in it lies strictly inside `(low, high)`.
2. Base case: `node` is None, return True — an empty subtree satisfies any interval.
3. Check `low < node.val < high`. Strict on both sides: duplicates are not allowed in this problem, and equal to a bound would mean equal to some ancestor.
4. Recurse left with `(low, node.val)` — everything in the left subtree must stay under this node while still respecting whatever ceiling an ancestor already imposed.
5. Recurse right with `(node.val, high)` — symmetric, the floor rises to this node.
6. Return the `and` of both, which short-circuits on the first violation.
7. Start with `valid(root, float('-inf'), float('inf'))`; the root is unbounded. (Node values fit in 32 bits, so the infinities are safe sentinels.)
8. Alternative worth remembering: an in-order walk of a BST is strictly increasing, so tracking `prev` and failing when `node.val <= prev` also works — same O(n)/O(h).

## Code

```python
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def valid(node, low, high):
            if not node:
                return True
            if not low < node.val < high:
                return False
            return valid(node.left, low, node.val) and valid(node.right, node.val, high)

        return valid(root, float('-inf'), float('inf'))
```

## Why it works

The step that leans on the ordering invariant is the recursion: because a BST requires *all* of the left subtree to be smaller than a node, tightening `high` to `node.val` on the way down is exactly the constraint every descendant on that side must obey, and by induction the interval reaching any node is the intersection of the constraints of all its ancestors. A tree passes iff every node satisfies its inherited interval, so a single failure anywhere is caught. Each node is visited once for O(n), with only the recursion stack as extra memory, O(h) — O(n) for a degenerate chain.
