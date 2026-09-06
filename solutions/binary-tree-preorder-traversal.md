---
# Binary Tree Preorder Traversal · Easy · Trees
# https://leetcode.com/problems/binary-tree-preorder-traversal/
draft: false
pattern: "Iterative preorder with explicit stack"
time: "O(n)"
space: "O(h)"
---

## Description

Given the root of a binary tree, return the values of its nodes in preorder traversal order: the node itself, then the left subtree, then the right subtree.

**Example**

```
Input: root = [1,null,2,3]
Output: [1,2,3]
```

Explanation: Visiting node-left-right starts at 1 (no left child), then its right child 2, then 2's left child 3, giving [1,2,3].

## Intuition

Pre-order is node, then left subtree, then right subtree — the node is emitted *before* I descend anywhere, which is what makes this the one traversal with a trivial iterative form. Because nothing has to be remembered about a node after I've printed it, I don't need the descend-then-come-back dance that in-order and post-order need: I just need a to-do list of subtrees. A stack is that list, and since a stack reverses, I push the right child first so the left child comes off next.

## Approach

1. Return `[]` immediately if `root` is None, so the stack never holds a None.
2. Initialise `res = []` and `stack = [root]`. Invariant: `stack` holds the roots of the subtrees still to be visited, in the order they must be visited, top first.
3. While `stack` is non-empty, pop `node` and append `node.val` to `res` — a node is emitted the moment it comes off, which is the "node first" of pre-order.
4. Push `node.right` if it exists, **then** push `node.left` if it exists. The order matters and is the only subtle line: the last push is popped first, so left is processed before right.
5. Return `res`.
6. If you want the recursive version instead: append `root.val`, recurse left, recurse right — same order, O(h) call stack instead of O(h) list.

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

At every step the stack, read top to bottom, is the exact list of subtree roots remaining in pre-order sequence; popping a node and replacing it with `[left, right]` at the top preserves that, since a subtree's pre-order is its root followed by the left subtree's sequence followed by the right's. Each node is pushed and popped exactly once, giving O(n). The stack never holds more than one node per level of the current path plus their right siblings, so it stays O(h) — O(n) for a right-skewed tree, where `res` dominates anyway.
