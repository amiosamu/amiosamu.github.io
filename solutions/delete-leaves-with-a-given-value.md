---
# Delete Leaves With a Given Value · Medium · Trees
# https://leetcode.com/problems/delete-leaves-with-a-given-value
draft: false
pattern: "Post-order prune, rebind child pointers"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree and `target`, repeatedly remove leaves whose value equals `target`.
Earlier removals may create new matching leaves. Return the remaining root.

**Example**

```
Input: root = [1,2,3,2,null,2,4], target = 2
Output: [1,null,3,null,4]
```

Removing the lower leaves valued 2 makes the root's left child a matching leaf, so it is
also removed. Node 4 remains under node 3.

## Intuition

A node can be tested correctly only after its children have been removed or retained.
Post-order traversal provides that ordering: prune both subtrees, reassign the returned
roots, and only then decide whether the current node has become a matching leaf. The
assignments mutate the retained tree by disconnecting removed nodes.

## Approach

1. Return `None` for an empty subtree.
2. Recursively prune both children and reassign `root.left` and `root.right` to the
   returned roots. This mutation disconnects every deleted subtree.
3. After both assignments, return `None` if the current node is now a leaf with value
   `target`.
4. Otherwise return `root`. The top-level call can return `None` when repeated pruning
   removes the entire tree.

## Code

```python
class Solution:
    def removeLeafNodes(self, root: Optional[TreeNode], target: int) -> Optional[TreeNode]:
        if not root:
            return None
        root.left = self.removeLeafNodes(root.left, target)
        root.right = self.removeLeafNodes(root.right, target)
        if not root.left and not root.right and root.val == target:
            return None
        return root
```

## Why it works

Use induction on subtree height. Empty subtrees are already fully pruned. For a non-empty
subtree, the recursive calls correctly prune both smaller child subtrees. The current test
therefore sees the node's final children: it removes the node exactly when those children
are absent and its value matches `target`. Otherwise the node cannot become removable
later because all changes below it are already complete. Thus the returned subtree is
fully pruned.

**Complexity**

- **Time:** `O(n)` because each node is visited once.
- **Space:** `O(h)` for recursion, where `h` is the tree height.
