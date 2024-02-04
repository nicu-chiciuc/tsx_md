import { object, string, bad, good } from '@robolex/sure'

const schema = object({
  name: string,

  age: val => {
    // Add for typescript
    if (typeof val !== 'number') {
      // when relying on JsDoc, this can be an replacement for `as const`
      return /** @type {const} */ ([false, 'age must be a number'])
    }

    if (!Number.isInteger(val) || val < 0 || val > 150) {
      // Or the `bad` function, since
      // it's typed automatically, and takes less to write
      return bad('not valid age')
    }

    // Or you can use `[true, val] as const`
    return good(val)
  },
})

const [ok, value] = schema({ name: 'John', age: -30 })

if (ok) {
  /*
  const value: {
      name: string;
      age: number;
  }
  */

  console.log(value.name)
} else {
  /* Infered type:
  
  const value: {
      name?: "not string" | undefined;
      age?: "age must be a number" | "age must be an integer" | "age must be a positive number" | "age must be less than 150" | undefined;
  }
  */
  console.log(value)
}
