---
# Subtree of Another Tree · Easy · Trees
# https://leetcode.com/problems/subtree-of-another-tree/
draft: false
pattern: "Same-tree check at every node"
time: "O(n * m)"
space: "O(n + m)"
---

## Intuition

A subtree isn't just a matching value somewhere — it's a node of `root` whose *entire* structure below equals `subRoot`. So the problem decomposes into two independent recursions: an outer scan that offers each node of `root` as a candidate anchor, and the Same Tree check that decides whether a given pair matches all the way down. Both walk in pre-order — the outer one because the anchor must be tested before descending past it, the inner one because a mismatch at the top should stop the comparison immediately.

## Approach

1. Write `isSameTree(p, q)` first, exactly as in Same Tree: both None → True; one None or values unequal → False; otherwise recurse on `(p.left, q.left)` and `(p.right, q.right)` joined by `and`.
2. In `isSubtree`, guard the empty cases: `subRoot` None → True (the empty tree is a subtree of anything); `root` None with `subRoot` non-None → False. Order matters, check `subRoot` first. LeetCode's constraints keep both non-empty, but the recursion generates None `root` on its own.
3. Anchor test: if `isSameTree(root, subRoot)` is True, return True — this node works as the anchor.
4. Otherwise recurse: `return self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)`. `subRoot` never changes; only the candidate anchor moves.
5. `or` short-circuits, so once a match is found in the left subtree the right one is never scanned.
6. Do **not** try to prune the scan by only anchoring where `root.val == subRoot.val` and then returning that result — a value can match at a node whose structure doesn't, and a valid anchor may sit deeper. The full `or` recursion is what keeps it correct.

## Code

```python
class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        if not subRoot:
            return True
        if not root:
            return False
        if self.isSameTree(root, subRoot):
            return True
        return self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)

    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if not p or not q or p.val != q.val:
            return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
```

## Why it works

If `subRoot` occurs as a subtree at all, it occurs anchored at some node of `root`, and the outer recursion visits every node of `root` as a candidate — so no occurrence can be missed; conversely a True only ever comes from `isSameTree` returning True on a full structural comparison, so no false positive slips through. The cost is one Same Tree check per anchor: O(m) work at each of the n nodes gives O(n · m), which is fine for the constraints (a linear-time solution exists by serializing both trees and running KMP, if the interviewer pushes). Space is the two nested call stacks, O(h_root + h_sub), which is O(n + m) when both trees are chains.
