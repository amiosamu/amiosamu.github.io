---
# Same Tree · Easy · Trees
# https://leetcode.com/problems/same-tree/
draft: false
pattern: "Parallel pre-order comparison"
time: "O(n)"
space: "O(h)"
---

## Description

Given the roots of two binary trees p and q, determine whether they are structurally identical and every pair of corresponding nodes holds the same value.

**Example**

```
Input: p = [1,2,3], q = [1,2,3]
Output: true
```

Explanation: Both trees have the same shape — a root valued 1 with left child 2 and right child 3 — and each matching pair of nodes carries the same value, so the trees are the same.

## Intuition

Two trees are identical when their roots match and their left subtrees are identical and their right subtrees are identical — the definition is already the recursion, so the only real work is getting the None cases right. I walk both trees in lockstep in pre-order: compare the node pair first, then descend. Pre-order is the useful order here because a mismatch at the top means the subtrees below it can never rescue the answer, so checking the node first lets `and` short-circuit and stop the descent immediately.

## Approach

1. Both None: return True. Two empty subtrees are the same subtree; this is the base case that terminates every branch.
2. Exactly one None: return False. Written as `if not p or not q` — reaching this line means they weren't both None, so one being None settles it. This catches the shape difference that value comparison alone would miss.
3. Values differ (`p.val != q.val`): return False. I fold this into the same condition as step 2, since by then both `p` and `q` are known non-None.
4. Return `isSameTree(p.left, q.left) and isSameTree(p.right, q.right)` — the pairing is what enforces the shape: `p.left` is only ever compared against `q.left`, never against `q.right`, so a mirrored tree correctly fails.
5. `and` short-circuits, so the right subtree isn't touched once the left has already disagreed.

## Code

```python
class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if not p or not q or p.val != q.val:
            return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
```

## Why it works

Structural equality of trees is defined inductively over (root value, left subtree, right subtree), and the three cases here — both empty, exactly one empty or unequal values, both present and equal — partition every possible node pair, so the recursion decides every case exactly once. Watch out for `p.val != q.val` where values can be falsy: the checks use `not p` on the node, never on the value, so a node holding `0` is handled fine. Each recursive call consumes one node from each tree and stops at the first difference, so time is O(n) with n the size of the smaller tree, and space is the call stack at O(h), up to O(n) for a chain.
