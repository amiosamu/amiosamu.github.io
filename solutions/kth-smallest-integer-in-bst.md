---
# Kth Smallest Element In a Bst · Medium · Trees
# https://leetcode.com/problems/kth-smallest-element-in-a-bst/
draft: false
pattern: "Iterative inorder, stop at k"
time: "O(h + k)"
space: "O(h)"
---

## Description

Given the root of a binary search tree and a 1-indexed integer `k`, return the `k`th smallest
value in the tree.

**Example**

```
Input: root = [3,1,4,null,2], k = 1
Output: 1
```

An inorder traversal produces `1, 2, 3, 4`, so the first value is `1`.

## Intuition

Inorder traversal visits a binary search tree in ascending value order. An explicit stack performs
that traversal lazily, so the algorithm can return at the `k`th visited node instead of storing or
traversing the complete ordering.

## Approach

1. Keep `cur` at the current node and `stack` for ancestors waiting to be visited.
2. Push the entire left path from `cur`; its final node is the smallest unvisited value.
3. Pop that node, decrement `k`, and return its value when `k` reaches zero.
4. Move `cur` to the popped node's right child, whose left path contains the next candidates.
5. Continue while a node or stacked ancestor remains. The constraints guarantee that the `k`th
   pop exists.

## Code

```python
class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack = []
        cur = root
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            k -= 1
            if k == 0:
                return cur.val
            cur = cur.right
```

## Why it works

For every BST node, all values in its left subtree precede the node, and all values in its right
subtree follow it in sorted order. The stack implements exactly this left-node-right traversal:
after exhausting a left path, its top is the smallest unvisited node, and moving to the right child
continues with the next values. Therefore nodes are popped in ascending order, making the `k`th pop
the `k`th smallest value.

**Complexity**

- **Time:** `O(h + k)`, where `h` is the tree height.
- **Space:** `O(h)` for the traversal stack.
