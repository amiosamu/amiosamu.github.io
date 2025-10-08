---
title: "My First Essay"
date: "2024-10-07"
description: "This is an example essay to demonstrate the markdown support."
tags: ["tutorial", "markdown", "example"]
---

# Welcome to My Blog

This is an example essay written in Markdown. You can use all standard Markdown features here.

## Features

Here are some things you can do:

- Write **bold** and *italic* text
- Create lists
- Add links like [this one](https://example.com)
- Include code snippets
- Add images with captions

## Code Examples with Syntax Highlighting

You can include inline code like `const x = 42` or code blocks with beautiful syntax highlighting:

### JavaScript
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

### Python
```python
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

print(f"Fibonacci(10) = {calculate_fibonacci(10)}")
```

### TypeScript
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (name: string, email: string): User => {
  return {
    id: Date.now(),
    name,
    email,
  };
};
```

### Bash
```bash
#!/bin/bash
echo "Hello, World!"
for i in {1..5}; do
  echo "Count: $i"
done
```

## Images

You can easily add images to your essays. Just place your images in the `public/images/` directory and reference them using standard Markdown syntax:

![Example blog image showing placeholder](/images/example-image.svg)

The alt text (text in square brackets) will be displayed as a caption below the image. Images are automatically styled with rounded corners and proper spacing.

You can also use external images:

![A mountain landscape](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop)

## Quotes

> This is a blockquote. You can use it to highlight important text or quotes from other sources.

## Conclusion

This is just a sample essay. Delete this file and add your own essays in the `essays/` directory!

