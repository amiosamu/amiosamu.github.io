---
# Asteroid Collision · Medium · Stack
# https://leetcode.com/problems/asteroid-collision/
draft: false
pattern: "Stack of surviving right-movers"
time: "O(n)"
space: "O(n)"
---

## Description

Given an array `asteroids`, where the sign gives direction and the absolute value gives size,
return the asteroids remaining after all collisions. A smaller asteroid is destroyed; equal-sized
asteroids destroy each other.

**Example**

```
Input: asteroids = [5,10,-5]
Output: [5,10]
```

The right-moving `10` destroys the left-moving `-5`, leaving `[5,10]`.

## Intuition

During a left-to-right scan, only a positive survivor followed by a new negative asteroid can
collide. A stack preserves the surviving order and exposes the nearest possible collision at its
top. A negative asteroid may destroy several smaller positive asteroids before it is either
destroyed, tied, or safely appended.

## Approach

1. Keep `stack` as the surviving prefix. For each asteroid `a`, initially mark it `alive`.
2. While `a` is negative and the stack top is positive, compare their sizes.
3. Pop a smaller top and continue. For equal sizes, pop the top and destroy `a`; for a larger
   top, destroy only `a`.
4. Append `a` if it survives. Positive asteroids and compatible directions skip the collision
   loop automatically.
5. Return the stack, which remains in the original relative order.

## Code

```python
class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        stack = []
        for a in asteroids:
            alive = True
            while alive and a < 0 and stack and stack[-1] > 0:
                if stack[-1] < -a:
                    stack.pop()
                elif stack[-1] == -a:
                    stack.pop()
                    alive = False
                else:
                    alive = False
            if alive:
                stack.append(a)
        return stack
```

## Why it works

Before each new asteroid, `stack` is the fully resolved result for the processed prefix. If a
collision is possible, it must involve the nearest right-moving survivor, which is the stack
top. Each comparison applies the collision rule exactly and repeats only when the incoming
asteroid can reach another survivor. Appending it after the loop therefore restores the
invariant.

**Complexity**

- **Time:** `O(n)` because each asteroid is pushed once and popped at most once.
- **Space:** `O(n)` for the stack, which is also the returned result.
