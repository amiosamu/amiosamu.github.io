---
# Binary Tree Right Side View · Medium · Trees
# https://leetcode.com/problems/binary-tree-right-side-view/
draft: false
pattern: "BFS taking last node of each level"
time: "O(n)"
space: "O(n)"
---

## Description

Given the root of a binary tree, return the values visible when the tree is viewed from the right side, ordered from the top level down: at each depth, the rightmost node present at that depth.

**Example**

```
Input: root = [1,2,3,null,5,null,4]
Output: [1,3,4]
```

Explanation: At depth 0 only 1 exists; at depth 1, 3 sits to the right of 2 and is the one visible; at depth 2, the only node is 4 (reached via 3's right child), so the view is [1,3,4].

## Intuition

Standing to the right, what I see at depth `d` is the *rightmost* node at depth `d` — not the right child of anything, since a node's right subtree can be empty while its left subtree keeps going. So this is a level-order question, not a "walk down the right spine" question. Run BFS level by level and keep the last node popped in each round; that node is the rightmost one at its depth by construction.

## Approach

1. Return `[]` if `root` is None.
2. Set `res = []` and `queue = collections.deque([root])`.
3. Outer loop while `queue` is non-empty. Invariant: at the top of each round the queue holds exactly the current level, left to right.
4. Freeze `n = len(queue)` before the inner loop — that is the width of this level, and it must not be re-read as children are appended.
5. Inner loop over `i in range(n)`: `popleft` a node, and if `i == n - 1` append `node.val` to `res`, because left-to-right order means the last pop of the round is the rightmost node at this depth.
6. Still inside the inner loop, push `node.left` then `node.right` if they exist — left first, so the next level also comes off left to right and the "last pop" rule keeps holding.
7. Return `res`.

## Code

```python
import collections

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        res = []
        queue = collections.deque([root])
        while queue:
            n = len(queue)
            for i in range(n):
                node = queue.popleft()
                if i == n - 1:
                    res.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        return res
```

## Why it works

Pushing left before right preserves left-to-right order within every level, so the final node dequeued in a round is the rightmost node of that depth — exactly what blocks the view of everything behind it. Every depth that contains at least one node produces exactly one round, so `res` has one entry per level and no gaps. Each node is enqueued and dequeued once for O(n) time, and the queue holds at most two adjacent levels, up to about n/2 nodes, for O(n) space.
