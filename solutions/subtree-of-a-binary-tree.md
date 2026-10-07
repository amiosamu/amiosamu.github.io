---
# Subtree of Another Tree · Easy · Trees
# https://leetcode.com/problems/subtree-of-another-tree/
draft: false
pattern: "Same-tree check at every node"
time: "O(n * m)"
space: "O(n + m)"
---

## Description

Given binary-tree roots `root` and `subRoot`, return whether some node in `root` begins a
subtree with exactly the same structure and values as `subRoot`.

**Example**

```
Input: root = [3,4,5,1,2], subRoot = [4,1,2]
Output: true
```

The node valued `4`, together with its descendants, exactly matches `subRoot`.

## Intuition

A matching root value is not enough; every corresponding descendant and missing child must also
match. Separate the work into two recursions: one visits every possible anchor in `root`, and the
other compares the complete trees rooted at one candidate and `subRoot`.

## Approach

1. In `isSameTree`, return `True` when both nodes are absent and `False` when only one is
   absent or their values differ.
2. Otherwise compare both corresponding child pairs; both comparisons must succeed.
3. In `isSubtree`, treat an empty `subRoot` as a match and an empty candidate as a failure.
4. Test the current `root` as an anchor, then recursively test its left and right children.
5. Keep searching after a same-valued anchor fails because another occurrence may match deeper.

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

By structural induction, `isSameTree(p, q)` is true exactly when the two rooted trees are
identical: the base cases classify empty or mismatched roots, and the recursive case requires
equal roots and identical left and right subtrees. The outer recursion tests every node of `root`
as an anchor. Therefore it finds every possible occurrence, and it returns true only after a
complete structural comparison succeeds.

**Complexity**

- **Time:** `O(n * m)` in the worst case for `n` nodes in `root` and `m` in `subRoot`.
- **Space:** `O(h_root + h_sub)` recursion depth, at most `O(n + m)`.
