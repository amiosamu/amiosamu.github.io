---
# Maximum Depth of Binary Tree · Easy · Trees
# https://leetcode.com/problems/maximum-depth-of-binary-tree/
draft: false
pattern: "Post-order height recursion"
time: "O(n)"
space: "O(h)"
---

## Description

Given the root of a binary tree, return its maximum depth: the number of nodes along the longest path from the root down to the farthest leaf.

**Example**

```
Input: root = [3,9,20,null,null,15,7]
Output: 3
```

Explanation: The longest root-to-leaf path is 3 → 20 → 15 (or 3 → 20 → 7), which passes through 3 nodes, so the maximum depth is 3.

## Intuition

The depth of a tree is one more than the deeper of its two subtrees — that single sentence is the whole algorithm. It forces post-order, because a node cannot report its own depth until both children have reported theirs; the node's answer is assembled on the way back up, not on the way down. The empty tree has depth 0, which makes every missing child contribute 0 and removes the need to special-case leaves.

## Approach

1. Base case: `root is None` returns 0. A leaf then computes `1 + max(0, 0) = 1`, which is right, so leaves need no branch of their own.
2. Recurse into `root.left` and `root.right` to get the depth of each subtree.
3. Return `1 + max(left, right)` — the `1` is the current node, the `max` is the fact that depth measures the *longest* root-to-leaf path, not the shortest.
4. That is the entire function; there is nothing to accumulate in an outer variable, because the value each call returns is already the answer for its own subtree.
5. If you'd rather do it iteratively, BFS with a `deque` and count the number of level-by-level rounds — pop a whole level at a time using the queue's length, increment a counter per round. Same O(n) time, but O(w) space for the widest level instead of O(h).

## Code

```python
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```

## Why it works

Every root-to-leaf path in the tree starts with the root and then continues into exactly one of the two subtrees, so the longest such path is `1 + max` over the subtrees' longest paths — the recurrence covers every path with no double counting, and the None case anchors the induction. Each node is visited once and does constant work, so O(n) time. Space is the recursion stack, which holds one frame per level of the path currently being explored: O(h), degrading to O(n) when the tree is a single chain.
