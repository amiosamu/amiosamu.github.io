---
# Binary Tree Postorder Traversal · Easy · Trees
# https://leetcode.com/problems/binary-tree-postorder-traversal/
draft: false
pattern: "Reversed pre-order with a stack"
time: "O(n)"
space: "O(h)"
---

## Intuition

Post-order is left subtree, right subtree, then node — the node comes *last*, which is what makes the honest iterative version painful: when you pop a node off the stack you can't tell whether you're arriving at it for the first time or coming back from its right child, so you need a `last_visited` pointer to disambiguate. The trick that avoids all of it: run the easy pre-order loop but push left before right, which emits `node, right, left`, and then reverse the result. `node, right, left` reversed is exactly `left, right, node`.

## Approach

1. Return `[]` if `root` is None so the stack never holds a None.
2. Initialise `res = []` and `stack = [root]`. Invariant: `stack` holds subtree roots still to be visited, top first, in *reverse* post-order sequence.
3. While `stack` is non-empty, pop `node` and append `node.val` to `res`.
4. Push `node.left` first if it exists, **then** `node.right`. This is the one line that differs from pre-order: the last push pops first, so the right child is processed before the left, giving `node, right, left`.
5. Return `res[::-1]`. Reversing turns `node, right, left` into `left, right, node`, which is post-order.
6. If the interviewer bans the reversal: recurse instead — `postorder(left)`, `postorder(right)`, then append `node.val` — same O(h) stack, just implicit.

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
        return res[::-1]
```

## Why it works

Reverse-post-order of a tree is "node, then the right subtree's reverse-post-order, then the left subtree's" — that is a pre-order with the children swapped, and the loop produces it because popping a node and pushing `[left, right]` (so `right` sits on top) keeps the stack equal to the remaining sequence at every step. Reversing a sequence that is `node, R…, L…` yields `…L, …R, node`, and the same reversal applies recursively inside each subtree, so the whole output is genuine post-order. Each node is pushed and popped once, so O(n); the stack holds at most one node per level of the current path plus their siblings, so O(h) — O(log n) balanced, O(n) for a skewed tree.
