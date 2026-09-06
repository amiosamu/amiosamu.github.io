---
# Asteroid Collision · Medium · Stack
# https://leetcode.com/problems/asteroid-collision/
draft: false
pattern: "Stack of surviving right-movers"
time: "O(n)"
space: "O(n)"
---

## Description

Given an array `asteroids` where each value's sign gives its direction (positive moves right, negative moves left) and its absolute value gives its size, simulate all collisions between asteroids moving toward each other (the smaller one explodes, equal sizes both explode) and return the state of the asteroids once no more collisions occur.

**Example**

```
Input: asteroids = [5,10,-5]
Output: [5,10]
```

Explanation: `10` (moving right) and `-5` (moving left) collide; since `10` is bigger, `-5` explodes and `10` survives, leaving `[5,10]` (`5` never collides with anything).

## Intuition

A collision only ever happens between a right-mover and a left-mover that is to its right — `+` immediately followed by `-`. Everything else drifts apart forever. So I scan left to right keeping a stack of survivors: a new left-moving asteroid has to fight the right-movers on top of the stack, one at a time, and each fight either destroys it, destroys the top, or destroys both. Once the top of the stack is a left-mover, nothing arriving later can ever hit it, so the stack below is permanently settled.

## Approach

1. Keep `stack` of surviving asteroids in order. It becomes the answer directly.
2. For each `a` in `asteroids`, set `alive = True` and enter the fight loop.
3. Loop while `alive and a < 0 and stack and stack[-1] > 0` — that condition is exactly "`a` moves left, the nearest survivor moves right, so they collide".
4. If `stack[-1] < -a`, the top is smaller: pop it and keep looping, since `a` may still hit the next one.
5. If `stack[-1] == -a`, equal size: pop the top and set `alive = False`; both explode.
6. Otherwise the top is bigger: set `alive = False`, `a` explodes and the top survives untouched.
7. After the loop, if `alive` push `a`. This covers right-movers (which never fight on arrival) and left-movers that cleared the stack or met only left-movers.
8. Return `stack`.

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

The invariant is that `stack` holds the asteroids among the first `i` that can still be involved in a collision, in their original order, and it always looks like a (possibly empty) run of left-movers followed by a run of right-movers. Only the boundary between the top right-mover and an incoming left-mover can collide, which is why checking just `stack[-1]` is sufficient — and resolving collisions nearest-first is the true physical order, since the closest pair meets first. Every asteroid is pushed once and popped at most once, so O(n) time; the stack holds at most n asteroids and doubles as the returned array.
