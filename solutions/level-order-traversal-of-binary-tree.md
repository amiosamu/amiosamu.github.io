---
# Binary Tree Level Order Traversal · Medium · Trees
# https://leetcode.com/problems/binary-tree-level-order-traversal/
draft: false
pattern: "BFS with per-level queue snapshot"
time: "O(n)"
space: "O(n)"
---

## Description

Given the root of a binary tree, return the values of its nodes grouped level by level from the root downward, with each level's values listed left to right.

**Example**

```
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
```

Explanation: The root 3 forms the first level on its own, its children 9 and 20 form the second level, and 20's children 15 and 7 form the third level, giving [[3],[9,20],[15,7]].

## Intuition

A plain BFS with a queue already visits nodes in level order, but it hands me one flat stream and I can't tell where one level ends and the next begins. The fix is one line of bookkeeping: at the top of each round, the queue contains *exactly* the current level and nothing else, because I haven't pushed any of its children yet. So I snapshot `len(queue)` first and pop precisely that many nodes — those are one level, and everything I push during the round is the next one.

## Approach

1. Return `[]` if `root` is None; the queue must never be seeded with a None.
2. Set `res = []` and `queue = collections.deque([root])`.
3. Outer loop while `queue` is non-empty. Invariant at the top of each iteration: `queue` holds every node of the current level, left to right, and nothing else.
4. Read `len(queue)` **before** the inner loop and freeze it — that count is the width of this level. Reading it inside the loop would keep sliding as children are appended and the levels would smear together.
5. Inner loop, that many times: `popleft` a node, append `node.val` to a fresh `level` list, then append `node.left` and `node.right` if they exist. Children go to the back, so they can't be reached by this round's counter.
6. After the inner loop, append `level` to `res`. The queue now holds exactly the next level, restoring the invariant.
7. Return `res`.

## Code

```python
import collections

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        res = []
        queue = collections.deque([root])
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            res.append(level)
        return res
```

## Why it works

A FIFO queue seeded with the root visits nodes in non-decreasing depth order, and since every node of depth `d+1` is pushed by some node of depth `d`, the queue is at all times a run of depth-`d` nodes followed by a run of depth-`d+1` nodes — freezing the count at the boundary cuts it exactly at the level break. Each node is enqueued and dequeued once, so the time is O(n). The queue never holds more than two adjacent levels, and the widest level of a complete tree is about n/2 nodes, so auxiliary space is O(n).
