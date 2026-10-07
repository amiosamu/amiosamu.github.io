---
# Merge K Sorted Lists · Hard · Linked List
# https://leetcode.com/problems/merge-k-sorted-lists/
draft: false
pattern: "Pairwise merge until one list"
time: "O(N log k)"
space: "O(k)"
---

## Description

Given `k` linked lists sorted in ascending order, merge them into one sorted list and return its
head.

**Example**

```
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
```

Repeatedly selecting the smallest available head produces `[1,1,2,3,4,4,5,6]`.

## Intuition

Sequentially merging into a growing accumulator can revisit early nodes `k` times. Instead, merge
lists in pairs. Each round processes all nodes once and reduces the number of lists by about half,
so there are only `ceil(log k)` rounds.

The two-list merge relinks existing nodes; it does not allocate copies of list elements.

## Approach

1. Return `None` when `lists` is empty.
2. Pair adjacent list heads and append each `mergeTwo` result to a new `merged` array.
3. If a round has an unpaired list, merge it with `None`, which carries it forward unchanged.
4. In `mergeTwo`, append the smaller head to a dummy-headed result and advance that input.
5. Splice the non-empty remainder after one input ends. Repeat rounds until one list remains.

## Code

```python
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        if not lists:
            return None
        while len(lists) > 1:
            merged = []
            for i in range(0, len(lists), 2):
                l1 = lists[i]
                l2 = lists[i + 1] if i + 1 < len(lists) else None
                merged.append(self.mergeTwo(l1, l2))
            lists = merged
        return lists[0]

    def mergeTwo(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        tail = dummy
        while l1 and l2:
            if l1.val <= l2.val:
                tail.next = l1
                l1 = l1.next
            else:
                tail.next = l2
                l2 = l2.next
            tail = tail.next
        tail.next = l1 if l1 else l2
        return dummy.next
```

## Why it works

During `mergeTwo`, the output is sorted and contains exactly the nodes removed from both inputs.
The smallest remaining node must be one of the two heads, so appending the smaller head preserves
the invariant; once one input ends, the other remainder is already sorted. Thus each pairwise merge
is correct. By induction over rounds, every resulting list is the sorted merge of its original
group, and the final list merges all inputs.

**Complexity**

- **Time:** `O(N log k)`, where `N` is the total node count.
- **Space:** `O(k)` for arrays of list heads. Existing nodes are relinked, mutating input chains.
