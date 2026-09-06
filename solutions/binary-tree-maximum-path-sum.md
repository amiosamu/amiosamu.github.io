---
# Binary Tree Maximum Path Sum · Hard · Trees
# https://leetcode.com/problems/binary-tree-maximum-path-sum/
draft: false
pattern: "Post-order gain down, global best through"
time: "O(n)"
space: "O(h)"
---

## Intuition

Every path has a unique highest node — the point where it stops going up and turns back down. So instead of enumerating paths, I enumerate that turning point: for each node, the best path whose apex is that node is `node.val` plus the best downward path into the left child plus the best downward path into the right child. But a path that *continues upward through* a node can only use one of its two sides, so the value I hand my parent is different from the value I score. Two different quantities, one traversal. The second trick is clamping negative contributions to 0 — a subtree that hurts is simply not entered.

## Approach

1. Keep `best = float('-inf')` in the enclosing scope, declared `nonlocal` in the helper. It can't start at 0: all values may be negative, and a path must contain at least one node.
2. Write `gain(node)` with an exact contract: **it returns the largest sum of a path that starts at `node` and goes strictly downward, using at most one child** — i.e. what this subtree can contribute to a path passing through its parent. It is *not* the answer for the subtree; the answer is accumulated into `best` as a side effect.
3. Base case: `node` is None, return 0.
4. `left = max(gain(node.left), 0)` and `right = max(gain(node.right), 0)`. Clamping at 0 encodes "if a branch's best downward path is negative, don't take it" — it is never worse to stop at the node.
5. Score this node as an apex: `best = max(best, node.val + left + right)`. This is the only place a two-sided path is ever considered, and it is legal precisely because such a path does not continue to the parent.
6. Return `node.val + max(left, right)` — one side only, because the parent will attach this to something above and a path can't fork.
7. Call `gain(root)` for the side effects, then return `best`.

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

Every non-empty path in the tree has exactly one node closest to the root, and at that node the path splits into at most one downward chain on each side — so the candidate scored at each node covers every path exactly once, and taking the maximum over all nodes covers all of them. Clamping to 0 is safe because dropping a negative-sum branch always yields a path that is still valid (the apex alone is a path) and no worse. Each node is visited once with O(1) arithmetic, so the traversal is O(n), and the only extra memory is the recursion stack at O(h), which is O(n) for a degenerate tree.
