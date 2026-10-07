---
# Same Tree · Easy · Trees
# https://leetcode.com/problems/same-tree/
draft: false
pattern: "Parallel pre-order comparison"
time: "O(n)"
space: "O(h)"
---

## Description

Given the roots of two binary trees `p` and `q`, determine whether they have the same structure
and equal values at every corresponding node.

**Example**

```
Input: p = [1,2,3], q = [1,2,3]
Output: true
```

Explanation: Both trees have root `1`, left child `2`, and right child `3`, so they are equal.

## Intuition

Tree equality is recursive: corresponding roots must match, as must their left and right
subtrees. Comparing node pairs before descending detects value or shape differences as soon as
possible. Empty subtrees require separate handling because two missing nodes match, while one
missing node and one real node do not.

## Approach

1. Return `True` when both nodes are `None`; both subtrees are empty.
2. Return `False` when only one node is missing or their values differ.
3. Recursively compare the two left subtrees and the two right subtrees.
4. Combine the recursive results with `and`, which also avoids exploring the right side after a
   mismatch on the left.

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

Use induction on the compared subtree pair. Two empty subtrees are equal, establishing the base
case. If exactly one root is missing or the root values differ, the subtrees cannot be equal.
Otherwise, the induction hypothesis says each recursive call correctly decides equality of its
child pair. The current subtrees are therefore equal exactly when both child pairs are equal.
The checks test node existence rather than node values, so a value such as `0` is handled
normally.

**Complexity**

- **Time:** `O(n)`, where `n` is the number of corresponding nodes examined.
- **Space:** `O(h)` for recursion, where `h` is the greater examined tree height.
