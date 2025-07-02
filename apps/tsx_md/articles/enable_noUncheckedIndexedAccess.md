---
title: How to live with `noUncheckedIndexedAccess`
description: Real-life tips to write write code with `noUncheckedIndexedAccess` without getting tons of type errors.
status: draft
---


Add these functions/types

```ts
export type Array1<T> = [T, ...T[]]
export type Array2<T> = [T, T, ...T[]]

export function atLeast<T>(n: 1, arr: T[]): arr is Array1<T>
export function atLeast<T>(n: 2, arr: T[]): arr is Array2<T>
export function atLeast<T>(n: number, arr: T[]): arr is T[] {
  return arr.length >= n
}


export function excactly<T>(length: 1, arr: T[]): arr is [T]
export function excactly<T>(length: 2, arr: T[]): arr is [T, T]
export function excactly<T>(length: number, arr: T[]): arr is T[] {
  return arr.length === length
}

export function last<T>(arr: Array1<T>): T
export function last<T>(arr: T[]): T | undefined
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}
```

TODO: You can also use an existing type library with more complex types, but simpler is simpler.

```ts
function foo(arr: number[]) {
  if (arr.length > 0) {
    const last = arr[arr.length - 1]
    
    return last
  }
  

  return 'empty'
}
```

changed to

```ts
function foo(arr: number[]) {
  if (atLeast(1, arr)) {
    const last = last(arr)
    
    return last
  } 

  return 'empty'
}
```

