---
# Diameter of Binary Tree · Easy · Trees
# https://leetcode.com/problems/diameter-of-binary-tree/
draft: false
pattern: "Post-order height, answer on the side"
time: "O(n)"
space: "O(h)"
---

## Intuition

Any path in a binary tree has a single highest node, and from there it goes down at most once to the left and at most once to the right. So the longest path *through a given node* is `height(left) + height(right)` edges, and the diameter is the max of that over all nodes. The trap is computing heights separately for every node — that's O(n²). One post-order pass fixes it: while each call is computing its own height it already holds both children's heights, so it can score its own node for free on the way back up.

## Approach

1. Keep `best = 0` in the enclosing scope and declare `nonlocal best` inside the helper. This is the running maximum diameter in **edges**, which is what the problem asks for.
2. Write `height(node)` with an explicit contract: **it returns the height of the subtree in nodes** (None → 0, leaf → 1), *not* the diameter. The diameter leaves through `best`. This mismatch between what the helper returns and what the problem returns is the whole reason the one-pass trick works — don't try to make it return both.
3. Base case: `node is None` returns 0.
4. Compute `left = height(node.left)` and `right = height(node.right)` — both children first, which is what makes this post-order.
5. Update `best = max(best, left + right)`. Adding the two node-counts gives the *edge* count of the path through this node, because the node itself is counted in neither child's height: for a leaf that's `0 + 0 = 0`, for a node with two leaf children it's `1 + 1 = 2`.
6. Return `1 + max(left, right)` — the height contract, ignoring the sibling branch, since a path continuing up through the parent can only use one side.
7. Call `height(root)` for its side effect and return `best`. A single-node tree returns 0, which is correct.

## Code

```python
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        best = 0

        def height(node: Optional[TreeNode]) -> int:
            nonlocal best
            if not node:
                return 0
            left = height(node.left)
            right = height(node.right)
            best = max(best, left + right)
            return 1 + max(left, right)

        height(root)
        return best
```

## Why it works

Every path has a unique topmost node, so partitioning all paths by that node loses nothing; when the helper visits that node it evaluates exactly the best path topped there, `left + right`, so the maximum over all nodes is the diameter. The returned height is deliberately the longer *single* branch, because that is all a parent can splice onto its own path. Each node is visited once and does O(1) work on top of its children's results, giving O(n) instead of the O(n²) of recomputing heights; the extra space is the call stack, O(h), which is O(n) for a skewed tree.
