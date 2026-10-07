---
# Delete Node in a BST · Medium · Trees
# https://leetcode.com/problems/delete-node-in-a-bst/
draft: false
pattern: "Search down, splice with successor"
time: "O(h)"
space: "O(h)"
---

## Description

Given a binary search tree and `key`, delete the node with that value while preserving the
BST property. Return the possibly changed root. If the key is absent, return the tree
unchanged.

**Example**

```
Input: root = [5,3,6,2,4,null,7], key = 3
Output: [5,4,6,2,null,null,7]
```

Node 3 has two children. Its in-order successor, 4, replaces it, and the original node 4
is then removed from the right subtree.

## Intuition

BST ordering identifies which subtree can contain the key. Once found, a node with at most
one child can be replaced directly by that child. A node with two children needs a value
that remains between both subtrees.

The smallest value in the right subtree, the in-order successor, has exactly that property.
Copying it mutates the found node; recursively deleting the original successor then removes
the duplicate value.

## Approach

1. If `root` is `None`, return `None`. Otherwise recurse left or right according to the
   comparison with `root.val`, assigning the returned subtree root back to that child.
2. When the key is found, return the other child if either child is missing. This also
   handles deleting a leaf.
3. With two children, walk left from `root.right` to find `succ`, the smallest value in
   the right subtree.
4. Copy `succ.val` into `root`, then delete that value from `root.right` and reassign the
   returned pointer.
5. Return `root`, which may now contain a changed value or child pointer. If `key` is
   absent, recursive calls return every original pointer unchanged.

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

Induct on subtree height. The recursive search modifies only the side that can contain the
key and returns a valid replacement root. For a found node with at most one child, that
child already satisfies every ancestor bound and can be spliced in directly. With two
children, the successor is greater than every left value and smaller than every other
right-subtree value. Replacing the node with it preserves ordering, and deleting its old
copy removes the duplicate. Therefore every returned subtree remains a valid BST.

**Complexity**

- **Time:** `O(h)`, where `h` is the tree height.
- **Space:** `O(h)` for the recursion stack.
