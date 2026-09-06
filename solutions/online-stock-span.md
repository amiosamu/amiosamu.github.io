---
# Online Stock Span · Medium · Stack
# https://leetcode.com/problems/online-stock-span/
draft: false
pattern: "Monotonic decreasing stack of (price, span)"
time: "O(1) amortized per call"
space: "O(n)"
---

## Intuition

The span ends at the first strictly *greater* price to the left, so this is "previous greater element" answered online. Walking back day by day is O(n) per call, but notice that once a day is swallowed by a later, higher price, it can never end anyone's span again — a taller wall stands in front of it. So I keep a stack that is decreasing in price, and when today's price absorbs the top I do not re-walk the days it covered: I add its already-computed span in one step. Each stack entry is a `(price, span)` pair — the span is the memo that makes the collapse O(1).

## Approach

1. `self.stack` holds `(price, span)` pairs, decreasing in price from bottom to top. Each entry's `span` is how many consecutive days that price already dominates, including itself.
2. On `next(price)`, start `span = 1` for today itself.
3. While the stack is non-empty and `self.stack[-1][0] <= price`: pop it and do `span += popped_span`. **Popping means today's price is greater than or equal to that day, so today swallows that day's entire block** — its span days plus today are all part of today's span, and that day can never terminate a future span because today shadows it.
4. Use `<=`, not `<`: the span counts days with price *less than or equal to* today, so an equal price must be absorbed, not treated as a wall.
5. Stop when the top has a strictly greater price — that is the wall that ends today's span.
6. Push `(price, span)` and return `span`.
7. The stack is never emptied except when today is the highest price so far, in which case `span` is the number of days seen.

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

The invariant is that the stack holds the strictly decreasing sequence of "record" prices still visible from the right, and their spans partition all days seen so far into contiguous blocks. So absorbing a top entry absorbs a whole block of consecutive days at once, and the loop stops at the first strictly greater price, which is exactly where the span must end. Discarding the popped days is safe because any future price that beats today already beats them, so they could never bound a later span. Each day is pushed once and popped at most once across the whole lifetime of the object, giving O(1) amortized per call and O(n) space for n calls.
