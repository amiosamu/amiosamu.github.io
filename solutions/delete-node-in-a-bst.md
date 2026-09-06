---
# Delete Node in a BST · Medium · Trees
# https://leetcode.com/problems/delete-node-in-a-bst/
draft: false
pattern: "Search down, splice with successor"
time: "O(h)"
space: "O(h)"
---

## Intuition

Finding the node is the easy half — a plain BST descent. The hard half is that removing a node with two children leaves a hole that neither child can fill on its own: promoting the left child would strand the right subtree, and vice versa. The only value that can sit in that hole is one that's still greater than everything on the left and less than everything on the right, and there are exactly two such values — the in-order predecessor and the in-order successor. I take the successor, the leftmost node of the right subtree, copy its value into the hole, and then delete *it* instead, which is a strictly easier deletion because a leftmost node has no left child.

## Approach

1. Make the function return the (possibly new) root of the subtree it was given, and always assign the result back: `root.left = self.deleteNode(root.left, key)`. This reassignment-on-unwind idiom is what lets a child be replaced without ever tracking a parent pointer.
2. `root is None` → return None. Key not in the tree, nothing to do.
3. `key < root.val` → recurse left and assign to `root.left`; `key > root.val` → recurse right and assign to `root.right`. Then fall through to `return root`.
4. Found it (`key == root.val`). Three cases:
   - no left child → return `root.right` (covers the leaf case too, since that's None);
   - no right child → return `root.left`;
   - two children → the interesting one.
5. Two children: walk `succ = root.right`, then `while succ.left: succ = succ.left`. `succ` is now the in-order successor — the smallest value greater than `root.val`.
6. Copy `root.val = succ.val`, then remove the duplicate with `root.right = self.deleteNode(root.right, succ.val)`. That inner delete recurses down the left spine and lands in case "no left child", so it never recurses a second time into a two-child node.
7. Return `root` at the end. The top-level call returns the new tree root, which differs from the original only when the root itself was deleted.
8. Traversal shape: a descent to find the node, with the rewiring happening on the way back up — the assignment in step 1 is the only thing that makes the parent's pointer follow the child's replacement.

## Code

```python
class Solution:
    def deleteNode(self, root: Optional[TreeNode], key: int) -> Optional[TreeNode]:
        if not root:
            return None
        if key < root.val:
            root.left = self.deleteNode(root.left, key)
        elif key > root.val:
            root.right = self.deleteNode(root.right, key)
        else:
            if not root.left:
                return root.right
            if not root.right:
                return root.left
            succ = root.right
            while succ.left:
                succ = succ.left
            root.val = succ.val
            root.right = self.deleteNode(root.right, succ.val)
        return root
```

## Why it works

The successor is the minimum of the right subtree, so it is larger than every value in the left subtree and no larger than every remaining value in the right — exactly the two conditions the hole demands — which is why overwriting `root.val` with it keeps the BST valid, and deleting the old copy keeps values unique. The one- and zero-child cases splice the surviving child straight into the parent's slot, which is legal because that whole subtree already sat on the correct side of every ancestor. Cost is one descent to find the key, one descent to find the successor, and one more to remove it, all bounded by the height: O(h) time and O(h) recursion stack, O(log n) on a balanced tree and O(n) on a chain.
