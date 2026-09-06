---
# Delete Leaves With a Given Value · Medium · Trees
# https://leetcode.com/problems/delete-leaves-with-a-given-value
draft: false
pattern: "Post-order prune, rebind child pointers"
time: "O(n)"
space: "O(h)"
---

## Description

Given the root of a binary tree and an integer target, repeatedly remove leaf nodes whose value equals target — including new leaves created by earlier removals — until no leaf holds that value, and return the resulting root.

**Example**

```
Input: root = [1,2,3,2,null,2,4], target = 2
Output: [1,null,3,null,4]
```

Explanation: Node 2 (root's left child) has a leaf child valued 2, which is removed first; that leaves node 2 itself childless, and since its own value also equals the target it is removed too, so root's whole left subtree disappears. On the right, node 3's leaf child valued 2 is removed, but node 3 keeps its other child (leaf 4) and its own value isn't the target, so it survives — giving [1,null,3,null,4].

## Intuition

The cascade is what makes this more than a filter: deleting a leaf can turn its parent into a leaf, which may then also qualify. Doing that with repeated top-down passes would be O(n) passes in the worst case. But if I prune children *before* testing a node, the cascade is already handled by the time I look at it — a node's leaf-ness is evaluated against the post-pruning tree, in one bottom-up sweep. That's post-order, and it's forced: the test at a node depends on its children's fate.

## Approach

1. Recurse on the same method rather than a helper — its signature already returns `Optional[TreeNode]`, which is exactly what a pruning function needs. The contract: `removeLeafNodes(node, target)` returns the pruned version of `node`'s subtree, or None if the whole subtree disappears.
2. Base case: `node` is None, return None.
3. **Reassign** the child pointers from the recursive calls: `root.left = removeLeafNodes(root.left, target)` and the same for `right`. Reassignment is the whole trick — merely calling the recursion without storing the result would leave dead children attached and the cascade would never happen.
4. Now, after both children have been pruned, test this node: if `not root.left and not root.right and root.val == target`, it is a leaf with the target value, so return None and let the caller unhook it.
5. Otherwise return `root` unchanged.
6. The top-level call can legitimately return None — a tree like `[2, 2, 2]` with `target = 2` deletes down to nothing — so don't guard against it.

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

By induction on subtree height: when the test at a node runs, both of its subtrees have already been fully and repeatedly pruned, so `root.left is None and root.right is None` means the node is a leaf in the final tree, not merely in the original one — which is exactly the fixed point the problem asks for, reached in a single pass. Nothing that survives can become deletable later, because a node only ever loses children, and losing children is precisely the condition the test already saw. Each node is visited once with O(1) work, so O(n) time and O(h) stack, degrading to O(n) on a skewed tree.
