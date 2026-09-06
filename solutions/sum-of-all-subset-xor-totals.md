---
# Sum of All Subsets XOR Total · Easy · Backtracking
# https://leetcode.com/problems/sum-of-all-subset-xor-totals
draft: false
pattern: "Include/exclude subset recursion"
time: "O(2^n)"
space: "O(n)"
---

## Intuition

`nums` has at most 12 elements, so 2^n subsets is 4096 — I can just walk every one of them. The only thing worth noticing is that I never need to materialize a subset: XOR is associative and I build the subset one element at a time, so I can carry the running XOR down the recursion as a plain integer. Each element is a single binary decision — take it (XOR it into `cur`) or skip it — and the answer is the sum of `cur` over all 2^n leaves.

## Approach

1. The decision at depth `i` is what to do with `nums[i]`: include it or not. There are only two branches, so no loop is needed.
2. The "path" is compressed to one integer, `cur`, holding the XOR of everything included so far. That is the whole state — nothing else about which elements were taken matters to the total.
3. Base case: `i == len(nums)` means every element has been decided, so this leaf is one complete subset and its XOR total is `cur`. Return `cur`.
4. Recurse twice: `dfs(i + 1, cur ^ nums[i])` for "take" and `dfs(i + 1, cur)` for "skip", and return their sum. Summing the two return values is what accumulates the answer, so there is no result list at all.
5. Because `cur` is an immutable int passed by value, there is nothing to undo after recursing — the "skip" branch simply gets the untouched `cur`. This is the one problem in the group where explicit backtracking disappears.
6. No pruning and no duplicate handling: every subset is counted, and repeated values in `nums` produce genuinely distinct subsets (subsets are by index here, not by value), so equal siblings must **not** be skipped.
7. Start with `dfs(0, 0)` — the empty subset has XOR 0, which correctly contributes 0.

## Code

```python
class Solution:
    def subsetXORSum(self, nums: List[int]) -> int:
        def dfs(i: int, cur: int) -> int:
            if i == len(nums):
                return cur
            return dfs(i + 1, cur ^ nums[i]) + dfs(i + 1, cur)

        return dfs(0, 0)
```

## Why it works

The recursion tree has exactly one leaf per subset — the path from root to leaf is the sequence of take/skip decisions that names it — and each leaf returns the XOR of its own subset, so the root's sum is the sum over all subsets by construction. Carrying `cur` down instead of rebuilding it at the leaf is valid because XOR is associative, so the order in which elements are folded in doesn't change the result. The tree has 2^(n+1) - 1 nodes with O(1) work each, giving O(2^n) time, and the only memory is the recursion stack of depth n.

If you want the O(n) version: bit `b` is set in some subset's XOR in exactly half of all subsets whenever any number has bit `b` set, so the answer is `(nums[0] | nums[1] | ... ) << (n - 1)`.
