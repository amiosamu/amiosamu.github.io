---
# Merge K Sorted Lists · Hard · Linked List
# https://leetcode.com/problems/merge-k-sorted-lists/
draft: false
pattern: "Pairwise merge until one list"
time: "O(N log k)"
space: "O(k)"
---

## Intuition

Merging the lists one at a time into an accumulator re-walks the growing result on every merge,
which is O(Nk). Pair them up instead: merge lists 0 and 1, 2 and 3, and so on, halving the
number of lists each round. Every round still touches all N nodes exactly once, but there are
only `log k` rounds, so the total is O(N log k) — the same bound a heap gives, without the heap.

## Approach

1. Return `None` immediately for an empty `lists`; the loop below assumes at least one entry.
2. Outer loop `while len(lists) > 1`. Each pass builds a fresh `merged` array.
3. Step `i` over `range(0, len(lists), 2)`. Take `l1 = lists[i]` and
   `l2 = lists[i + 1] if i + 1 < len(lists) else None` — the guard covers an odd count, where the
   last list has no partner and is carried forward unchanged (merging with `None` returns it
   as-is).
4. Append `self.mergeTwo(l1, l2)` to `merged`, then `lists = merged` and repeat.
5. `mergeTwo` is the two-pointer splice: `dummy = ListNode()` and `tail = dummy`, then while both
   are non-empty attach the smaller head with `<=` (keeps the merge stable), advance that list,
   and `tail = tail.next`. The dummy is there so the first append needs no "is the output still
   empty?" branch.
6. When one input runs out, `tail.next = l1 if l1 else l2` splices the entire remainder in one
   assignment — it is already sorted and every value in it is at least the last emitted.
7. Return `dummy.next` from `mergeTwo` and `lists[0]` from the driver.
8. Individual entries of `lists` may be `None`; nothing here dereferences a head without a
   truthiness check, so that is already handled.

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

`mergeTwo` is correct because the smallest unemitted value is always at the head of one of the
two lists, so taking `min(l1.val, l2.val)` preserves the invariant that the output is sorted and
bounded above by both remaining heads. Merging sorted lists is associative, so any pairing
schedule produces the same final order — the tournament shape only changes the cost. Each round
does O(total nodes in that round) = O(N) work and the list count halves, giving `⌈log k⌉` rounds
and O(N log k) time; the only extra memory is the array of at most `k` heads, so O(k) space with
no nodes copied.
