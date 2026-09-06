---
# Count Good Nodes In Binary Tree · Medium · Trees
# https://leetcode.com/problems/count-good-nodes-in-binary-tree/
draft: false
pattern: "DFS carrying path maximum down"
time: "O(n)"
space: "O(h)"
---

## Intuition

"No node on the path from root to X has a value greater than X" is a statement about X's ancestors only, and I don't need the whole list of them — I only need their maximum. That maximum is a single number I can carry down as a parameter, updated at each step. So one pre-order DFS threading `best` (the largest value seen on the path so far, root included) answers every node in O(1) as I arrive at it.

## Approach

1. Write a helper `dfs(node, best)` where `best` is the maximum value on the path from the root down to `node`'s parent, and which returns the number of good nodes in `node`'s subtree.
2. Base case: `node` is None, return 0.
3. `node` is good iff `node.val >= best` — note the `>=`, since "no ancestor is *greater*" allows ties. Score 1 or 0 accordingly.
4. Update `best = max(best, node.val)` **before** recursing, so children see a maximum that includes this node.
5. Return that score plus `dfs(node.left, best)` plus `dfs(node.right, best)`.
6. Kick off with `dfs(root, float('-inf'))`. Seeding with negative infinity rather than `root.val` means the root is counted by the same rule as everything else and no separate case is needed, and it also makes the empty-tree call return 0 for free.

## Code

```python
class Solution:
    def goodNodes(self, root: Optional[TreeNode]) -> int:
        def dfs(node, best):
            if not node:
                return 0
            good = 1 if node.val >= best else 0
            best = max(best, node.val)
            return good + dfs(node.left, best) + dfs(node.right, best)

        return dfs(root, float('-inf'))
```

## Why it works

`best` is passed by value down each branch, so a sibling's values never leak across — each node is tested against the maximum of its own root-to-parent path and nothing else, which is precisely the definition of good. Because the sets of good nodes in the left and right subtrees are disjoint and together with the current node cover the whole subtree, summing the two recursive counts is exact. Every node is visited once for O(n), and the only extra memory is the call stack, O(h), which degrades to O(n) on a skewed tree.
