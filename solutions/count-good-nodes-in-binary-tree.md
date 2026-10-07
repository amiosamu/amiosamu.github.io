---
# Count Good Nodes In Binary Tree · Medium · Trees
# https://leetcode.com/problems/count-good-nodes-in-binary-tree/
draft: false
pattern: "DFS carrying path maximum down"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree, count nodes whose value is at least every value on the path from the root
to that node.

**Example**

```
Input: root = [3,1,4,3,null,1,5]
Output: 4
```

The root, the descendant valued 3, the node valued 4, and the node valued 5 are good. Both nodes
valued 1 have a larger ancestor.

## Intuition

Only the maximum ancestor value matters. Carry that value down during DFS, compare each node
against it, then include the current value in the maximum passed to the children. Each branch
receives its own scalar value, so sibling paths do not affect one another.

## Approach

1. Define `dfs(node, best)`, where `best` is the maximum value from the root through the
   parent, and return zero for a null node.
2. Count the current node when `node.val >= best`; equality qualifies.
3. Update `best = max(best, node.val)` and add the recursive counts from both children.
4. Start with negative infinity so the root uses the same rule. An empty tree naturally returns
   zero, and the tree is not mutated.

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

For every call, `best` equals the maximum on that node's root-to-parent path. The initial call
establishes this, and updating with `node.val` preserves it for both children. Therefore the
comparison counts exactly the good current nodes. The current node and the two subtrees are
disjoint and exhaustive, so summing their counts returns the exact subtree total by induction.

**Complexity**

- **Time:** `O(n)` because every node is visited once.
- **Space:** `O(h)` recursion space, where `h` is the tree height and can be `n`.
