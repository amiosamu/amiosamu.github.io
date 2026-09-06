---
# Insert into a Binary Search Tree · Medium · Trees
# https://leetcode.com/problems/insert-into-a-binary-search-tree/
draft: false
pattern: "Descend to the empty slot"
time: "O(h)"
space: "O(1)"
---

## Intuition

The problem says any valid BST is accepted, which removes all the rebalancing and makes this a pure search: run the same descent you'd run to *look up* `val`, and where the lookup would fall off the tree is exactly where the new node belongs. No existing node moves — the insert is a single pointer write on a node that currently has a missing child, so the new node is always a leaf. The only real care is stopping one level early, at the parent, since you have to write into `parent.left` or `parent.right`.

## Approach

1. If `root` is None the tree is empty — return `TreeNode(val)` as the new root. This is the only case where the returned root differs from the one passed in.
2. Otherwise set `cur = root` and loop forever. Invariant: `val` belongs somewhere in `cur`'s subtree.
3. If `val < cur.val`, the new node goes left. If `cur.left` is None, that's the empty slot: set `cur.left = TreeNode(val)` and return `root`. Otherwise step down with `cur = cur.left`.
4. Else (`val > cur.val`; the problem guarantees `val` isn't already present) mirror it on the right: if `cur.right` is None set `cur.right = TreeNode(val)` and return `root`, otherwise `cur = cur.right`.
5. Return the *original* `root`, not `cur` — the function returns the root of the whole tree, and after step 1 that never changes.
6. The `while True` always terminates because each iteration descends one level and every path ends in a None child, so a slot is always found within h steps.
7. Recursive form if you prefer it: `if not root: return TreeNode(val)`, then `root.left = self.insertIntoBST(root.left, val)` or `root.right = ...`, then `return root`. Same logic, O(h) stack — the reassignment-on-the-way-back-up idiom is what makes it read cleanly.

## Code

```python
class Solution:
    def insertIntoBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        if not root:
            return TreeNode(val)
        cur = root
        while True:
            if val < cur.val:
                if not cur.left:
                    cur.left = TreeNode(val)
                    return root
                cur = cur.left
            else:
                if not cur.right:
                    cur.right = TreeNode(val)
                    return root
                cur = cur.right
```

## Why it works

The descent follows the unique path a search for `val` would take, so every node passed on the left has a value greater than `val` and every node passed on the right has a value smaller — hanging the new leaf at the end of that path therefore satisfies the BST property against every ancestor, and it has no descendants to violate. Nothing else in the tree is rewritten, so all other nodes' invariants are untouched. The walk costs one comparison per level: O(h) time, O(log n) on a balanced tree and O(n) on a skewed one, with O(1) extra space since the loop carries only `cur`.
