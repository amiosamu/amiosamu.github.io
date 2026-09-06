---
# Invert Binary Tree · Easy · Trees
# https://leetcode.com/problems/invert-binary-tree/
draft: false
pattern: "Recursive swap of children"
time: "O(n)"
space: "O(h)"
---

## Description

Given the root of a binary tree, produce its mirror image: the tree in which every node's left and right children have been swapped, recursively, throughout the whole tree.

**Example**

```
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]
```

Explanation: Root 4 keeps its value while its children 2 and 7 swap sides, becoming 7 and 2; within the new left subtree (rooted at 7) its children 6 and 9 swap to 9 and 6, and within the new right subtree (rooted at 2) its children 1 and 3 swap to 3 and 1, giving [4,7,2,9,6,3,1].

## Intuition

Mirroring a tree is one local operation repeated everywhere: at every node, swap its two child pointers. Nothing else moves — the subtrees keep their own shape and get mirrored by the same rule applied inside them. Because the swap at a node doesn't depend on anything computed in the subtrees, the traversal order is free; I use pre-order (swap, then recurse) simply because it reads as "fix this node, then fix what's below it".

## Approach

1. Base case: if `root` is None, return None. This covers the empty tree and every missing child, so the recursion needs no other guard.
2. Swap the children in one statement: `root.left, root.right = root.right, root.left`. Python evaluates the right-hand tuple first, so no temporary is needed.
3. Recurse on `root.left` and `root.right`. Note these are the *already swapped* pointers — that's harmless, because both subtrees get visited either way and each one is inverted independently.
4. Return `root`. The node object itself never changes identity, only its two pointers, so the caller's reference stays valid and the original `root` is the answer.
5. Iterative variant if you want to dodge the recursion: BFS with a `deque` (or DFS with a list) holding nodes to process — pop a node, swap its children, push the non-None children.

## Code

```python
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = root.right, root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root
```

## Why it works

The mirror of a tree is defined recursively as "a node whose left child is the mirror of the original right subtree and whose right child is the mirror of the original left subtree" — the swap supplies the outer half of that and the two recursive calls supply the inner half, so induction on height gives correctness, with the empty tree as the base. Every node is visited exactly once and does O(1) work, so O(n) time. The only extra memory is the call stack, one frame per level of the current path: O(h), which is O(log n) balanced and O(n) for a degenerate chain.
