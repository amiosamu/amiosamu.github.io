---
# Reverse Nodes In K Group · Hard · Linked List
# https://leetcode.com/problems/reverse-nodes-in-k-group/
draft: false
pattern: "Reverse fixed blocks, relink boundaries"
time: "O(n)"
space: "O(1)"
---

## Description

Given a linked-list head and integer `k`, reverse each complete group of `k` nodes and return the
new head. Leave a final group with fewer than `k` nodes unchanged.

**Example**

```
Input: head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]
```

Explanation: `[1,2]` and `[3,4]` reverse independently; the one-node remainder stays unchanged.

## Intuition

The difficult part is preserving each group's boundaries. Before changing links, verify that `k`
nodes remain and save the node after the group. Reverse the group with that successor as the
initial `prev`, so its old head becomes a tail already connected to the untouched remainder. A
dummy predecessor makes the same relinking work for the first group.

## Approach

1. Create `dummy` and set `groupPrev = dummy`, the predecessor of the next possible group.
2. Starting at `groupPrev`, advance `k` times to find `kth`. If any advance reaches `None`,
   return `dummy.next` without modifying the incomplete suffix.
3. Save `groupNext = kth.next`. Reverse nodes from `groupPrev.next` up to, but not including,
   `groupNext`, initializing `prev = groupNext` so the new tail is already attached.
4. Save `tmp = groupPrev.next`, the old group head and new tail. Set `groupPrev.next = kth` to
   attach the new head, then set `groupPrev = tmp` for the next group.
5. Saving `tmp` is required for progression, not reachability: after the front link changes, the
   old head remains reachable through the reversed group, but it is no longer directly named as
   the predecessor needed by the next iteration. All rewiring mutates the original list.

## Code

```python
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        groupPrev = dummy

        while True:
            kth = groupPrev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next
            groupNext = kth.next

            prev, cur = groupNext, groupPrev.next
            while cur is not groupNext:
                nxt = cur.next
                cur.next = prev
                prev = cur
                cur = nxt

            tmp = groupPrev.next
            groupPrev.next = kth
            groupPrev = tmp
```

## Why it works

Before each outer iteration, `groupPrev.next` starts the unreversed suffix and all preceding
complete groups are correctly linked. The count prevents any partial group from being changed.
For a complete group, the reversal maps its final node `kth` to the head and its original head to
the tail; initializing `prev` with `groupNext` attaches that tail to the remaining suffix.
Connecting `groupPrev.next` to `kth` completes the group, and assigning the saved old head to
`groupPrev` restores the invariant. Therefore every complete group is reversed once and the
incomplete suffix is preserved.

**Complexity**

- **Time:** `O(n)`; each node is counted and reversed at most once.
- **Space:** `O(1)` auxiliary space.
