---
# Online Stock Span · Medium · Stack
# https://leetcode.com/problems/online-stock-span/
draft: false
pattern: "Monotonic decreasing stack of (price, span)"
time: "O(1) amortized per call"
space: "O(n)"
---

## Description

Design a class that receives stock prices through `next(price)`. For each price, return the number
of consecutive days ending today whose prices are less than or equal to today's price.

**Example**

```
Input: ["StockSpanner","next","next","next","next","next","next","next"], [[],[100],[80],[60],[70],[60],[75],[85]]
Output: [null,1,1,1,2,1,4,6]
```

Explanation: At price `75`, the preceding prices `60`, `70`, and `60` are no greater, so the span
is those three days plus today: `4`.

## Intuition

The span ends immediately after the nearest earlier price that is strictly greater than today's.
Keep unresolved prices in a decreasing stack. Each entry stores both a price and the complete span
it already covers, allowing a new price to absorb an entire block with one pop rather than revisit
its days individually.

## Approach

1. Store `(price, span)` pairs in `self.stack`, with prices strictly decreasing upward.
2. Start each call with `span = 1` for the current day.
3. While the top price is at most the current price, pop it and add its stored span.
4. Push the combined `(price, span)` pair and return `span`. Equal prices are popped because they
   belong to the current span.

## Code

```python
class StockSpanner:

    def __init__(self):
        self.stack = []  # (price, span) pairs, decreasing in price

    def next(self, price: int) -> int:
        span = 1
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span
```

## Why it works

The stack entries represent contiguous blocks, and each stored price is at least every price in its
block. Popping an entry whose price is at most today's proves its entire block belongs to today's
span. The loop stops only at a strictly greater price, exactly the boundary that cannot be included.
The resulting span is therefore correct. Replacing popped blocks with today's combined block keeps
the stack strictly decreasing and preserves the invariant for future calls.

**Complexity**

- **Time:** `O(1)` amortized per call; each price is pushed once and popped at most once.
- **Space:** `O(n)` auxiliary space after `n` calls in the worst case.
