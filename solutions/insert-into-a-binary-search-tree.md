---
# Insert into a Binary Search Tree · Medium · Trees
# https://leetcode.com/problems/insert-into-a-binary-search-tree/
draft: false
pattern: "Descend to the empty slot"
time: "O(h)"
space: "O(1)"
---

## Description

Given a binary search tree and a value `val` not already present, insert `val` while
preserving the BST property and return the resulting root.

**Example**

```
Input: root = [4,2,7,1,3], val = 5
Output: [4,2,7,1,3,5]
```

Explanation: Search moves right from `4`, then left from `7`, and inserts `5` in the empty
child position.

## Intuition

Follow the same path used to search for `val`. Comparisons determine the only subtree where
the value can be placed. The first missing child on that path is a valid insertion point.

The new node is attached as a leaf; no existing node moves. The method mutates the tree and
returns the original root, except when the input tree is empty.

## Approach

1. If `root` is empty, return a new `TreeNode(val)` as the root.
2. Otherwise, keep `cur` at the current search node.
3. When `val < cur.val`, descend left or attach the new node if `cur.left` is empty.
4. Otherwise, descend right or attach at an empty `cur.right`. Equality is impossible by
   the problem guarantee.
5. Return the original root immediately after attachment. Each iteration descends one level,
   so an empty child is reached within the tree height.

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

At each node, the comparison selects the only child subtree whose ancestor bounds can
contain `val`. Those bounds remain valid throughout the descent. Attaching `val` at the
first empty child satisfies its comparison with the parent and every accumulated ancestor
bound. The node has no children, and all existing links remain unchanged, so the entire
tree retains the BST property.

**Complexity**

- **Time:** `O(h)`, where `h` is the tree height.
- **Space:** `O(1)` auxiliary space; one output node is allocated.
