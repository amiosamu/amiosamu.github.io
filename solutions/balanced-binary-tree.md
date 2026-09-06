---
# Balanced Binary Tree · Easy · Trees
# https://leetcode.com/problems/balanced-binary-tree/
draft: false
pattern: "Post-order height with -1 sentinel"
time: "O(n)"
space: "O(h)"
---

## Description

Given the root of a binary tree, determine whether it is height-balanced: for every node in the tree, the heights of its left and right subtrees differ by no more than 1.

**Example**

```
Input: root = [3,9,20,null,null,15,7]
Output: true
```

Explanation: Node 3's two subtrees have heights 1 (just node 9) and 2 (20 with children 15 and 7), a difference of 1, and every other node's subtrees differ by at most 1 as well, so the whole tree is balanced.

## Intuition

The naive reading — "for every node, compute both subtree heights and compare" — is O(n²), because each height call re-walks a whole subtree that its parent will walk again. But the height computation *already* visits every node in the right order, so the balance check can ride along inside it: a node checks `abs(left - right) <= 1` at the moment it has both heights in hand. To also propagate failure upward without a second return value, I overload the height with a sentinel: `-1` means "somewhere below me the tree is unbalanced", and a real height is always ≥ 0, so the two can never be confused.

## Approach

1. Write `height(node)` with an explicit contract: **it returns the subtree's height in nodes if that subtree is balanced, and `-1` if it is not**. The problem returns a bool; the helper returns an int. That mismatch is the point — the int carries the information the parent needs, the `-1` carries the failure.
2. Base case: `node is None` returns 0 (an empty tree is balanced with height 0).
3. `left = height(node.left)`; if `left == -1`, return `-1` immediately — no reason to look at the right subtree once the answer is settled.
4. `right = height(node.right)`; if `right == -1`, return `-1`.
5. Both subtrees are balanced, so now check *this* node: if `abs(left - right) > 1`, return `-1`.
6. Otherwise return `1 + max(left, right)`, the normal height.
7. Top level: return `height(root) != -1`.
8. Post-order is forced — the check at a node needs both children's heights, so the verdict is formed on the way back up, never on the way down.

## Code

```python
class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def height(node: Optional[TreeNode]) -> int:
            if not node:
                return 0
            left = height(node.left)
            if left == -1:
                return -1
            right = height(node.right)
            if right == -1:
                return -1
            if abs(left - right) > 1:
                return -1
            return 1 + max(left, right)

        return height(root) != -1
```

## Why it works

The tree is balanced exactly when every node satisfies the height condition, and the helper checks that condition once per node, so no node is missed; the `-1` is sticky — once returned it propagates up through every ancestor untouched — so a single violation anywhere makes the top-level call return `-1`. When no violation exists the return value is a genuine height, which is what the parent's own check consumes, so the two meanings never overlap. Because heights are computed bottom-up and reused instead of recomputed, each node is touched once: O(n) time, and O(h) stack space, which is O(n) for a degenerate chain (and note a chain of more than 2 nodes bails early anyway).
