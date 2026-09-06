---
# Lowest Common Ancestor of a Binary Search Tree · Medium · Trees
# https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
draft: false
pattern: "Descend until the values split"
time: "O(h)"
space: "O(1)"
---

## Intuition

In a general binary tree finding the LCA takes a full post-order pass, but the BST ordering hands it over for free: if both `p` and `q` are smaller than the current node they must both live in its left subtree, if both are larger they both live in its right, and in either case the current node is too high to be the *lowest* common ancestor. The first node where they don't agree on a direction — one goes left and the other right, or one of them *is* the node — is the answer. So it's a single root-to-node descent, no traversal and no recursion needed.

## Approach

1. Start `cur = root` and loop while `cur` is not None. The invariant: both `p` and `q` are somewhere in `cur`'s subtree.
2. If `p.val < cur.val` **and** `q.val < cur.val`, both are strictly in the left subtree — set `cur = cur.left`. The invariant is preserved by the BST property.
3. Else if `p.val > cur.val` **and** `q.val > cur.val`, both are in the right subtree — set `cur = cur.right`.
4. Otherwise return `cur`. "Otherwise" covers exactly two situations: the values straddle `cur`, or one of them equals `cur.val`. In the split case `cur` is the branch point; in the equality case a node is allowed to be its own descendant, so `cur` is again the answer.
5. The loop is guaranteed to return before `cur` becomes None, because the problem promises both nodes exist in the tree; the trailing `return None` is only there to satisfy the type checker.
6. Compare `.val`, not node identity — BST values are unique here, and comparing values is what lets the descent decide a direction.

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

Every common ancestor of `p` and `q` sits on the path from the root down to the split point, and the descent walks exactly that path: as long as both targets lie on the same side, the current node has a child that is still a common ancestor, so it can't be the lowest one and stepping down is safe. The moment they part ways — or one target is reached — no child contains both, so the current node is minimal by definition. The walk takes one step per level, O(h) time, which is O(log n) for a balanced BST and O(n) for a degenerate one; because it's iterative there's no call stack, so O(1) space (the recursive version is the same O(h) time but O(h) space).
