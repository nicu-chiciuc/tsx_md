---
title: I need to validate a form
description: Type-safe validation libraries are too complex, and this has to change.
---

> I strongly recommend you to read the article in a desktop environment, since you can hover over
> the code to see the types.

# Abstract

I'm trying to deliver as concisely and deeply as possible the issues I've encountered while trying
to make changes to the validation rules of a form that had around 22 fields (don't judge).

I was expecting to rely on the type-system to guide me, since I've already had experience with
`zod`, `io-ts` and other libraries that provided amazing type suggestions.

Even with more than 10 years of *coding experience*™️, it seemed strange that I had to dig through
documentation to do things that I thought I should already know.

Trying to have complete control and understanding of what's happening to a very small piece of a
system (form validation) that I thought was already a solved problem, I've realised that I was
getting blocked when trying to implement very specific business-related requirements that didn't
care about type-safeness or readable code or all the things we love and admire.

The format of the article was thought out almost a year ago, but only recently I managed to create
this blog, that I can also control. I wanted to give you the ability to hover over the values in the
code blocks and have the same experience you'd have in VsCode (literally using Monaco) or WebStorm
or other editors. Thanks to [vaakian/monaco-ts](https://github.com/vaakian/monaco-ts) and
@typescript/ata for this.

# Introduction

I'm using React (with Next.js)

`Formik` and `Yup` were already used in the project. They are one of most SEOed results. (at this
time `react-hook-form` took the lead)

But I also know about `zod`, I've used it and like how I get type-safety by default.

---

Now, here's a question for you.

I have these requirements and I need to represent them.

### Requirements

The form has **3** fields:

- `name` - The name of the person or organization
- `iban` - An IBAN (International Bank Account Number) but only for Moldova
- `individual_type` - A choice between `"individual"` and `"organization"`

The `name` is a string and is always required. An IBAN is required for 'organizations', can be empty
for 'individuals'.

so, a well formatted form json should look like this:

```ts
type FormValue = {
  name: string
  iban: string
  individual_type: 'individual' | 'organization'
}
```

## What does `required string` actually mean?

Even for seemingly simple things like `string()` there are some complex differences:

```js
import { z } from 'zod'
import * as y from 'yup'
import * as s from '@robolex/sure'

const value = undefined

const isValidZod = z.string().safeParse(value).success
const isValidYup = y.string().isValidSync(value)
const [isValidSure] = s.string(value)

console.log(isValidZod === false)
console.log(isValidYup === true) // Note that by default, yup allows undefined in schemas
console.log(isValidSure === false)
```

Using `.required()` in `yup` will make it fail for `undefined`, **but it will also fail for empty
strings**.

Trying to use `yup` to allow strings that can be empty is a world of hurt.
[This reddit post](https://www.reddit.com/r/reactjs/comments/13sdx7b/yup_how_to_skip_validation_when_value_is_empty/)
recommends doing something like this:

```ts
import * as yup from 'yup'

yup
  .string()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr))
```

The main differences between pre-type-safety libraries and post-type-safety libraries (`yup` and
`zod`) is the way they treat empty strings.

Using yup's `string()` without `.required()` allows passing `undefined`, '' (empty string) or any
other string. When `string().required()` is used, besides not allowing `undefined`, yup also shows
an error for empty strings.

When using `zod`, a `string()` by default allows an empty string and.

I figured I might as well do something like this:

```ts
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
```

At this point, I felt that there's too much complexity in these libraries.

### Too much complexity

The implementation of `yup`'s `string` is this:
[https://github.com/jquense/yup/blob/master/src/string.ts](https://github.com/jquense/yup/blob/master/src/string.ts)

The implementation contains 301 lines of code. Most of the functionality (uuid, email) is usually
better left for [validator.js](https://github.com/validatorjs/validator.js) since it's more tailored
for string validation.

Here's the implementation of `string` in `zod`:
[https://github.com/colinhacks/zod/blob/master/src/types.ts#L626](https://github.com/colinhacks/zod/blob/master/src/types.ts#L626)

It sits at just 443 lines of code, which can also be mostly delegated to `validator.js`.

This poses another question, how easy is to use validator.js with yup and zod.

## Sure can't be _THAT_ small

Before going forward I would like to show how can you implement `string` in `sure`:

```ts
const isString1 = (val: unknown) => {
  if (typeof val === 'string') {
    return [true, val] as const
  }

  return [false, 'not a string'] as const
}

const [isValid, value] = isString1('hello')

if (isValid) {
  // Hover over this to see the "expected" type
  value

  console.log(value)
} else {
  // Hover over this to see the "error" type
  value

  console.log()
}
```

of course, writing `as const` all day is not fun, so `@robolex/sure` provides these nice helpers:

```ts
import { bad, good } from '@robolex/sure'

const isString2 = (val: unknown) => {
  if (typeof val === 'string') return good(val)

  return bad('not a string')
}

const [isValid, value] = isString2('hello')

if (isValid) {
  // Hover over this to see the "expected" type
  value

  console.log(value)
} else {
  // Hover over this to see the "error" type
  value

  console.log()
}
```

You can use anything you wish for the error type, but I like to use strings since they are easy to
work with. At least much easier than catching errors then using `instanceof` and praying you don't
forget any error types.

Of course, adding metadata and more sophisticated type-safety is possible using `pure` and `sure`,
which are part of the core:

```ts
// https://github.com/robolex-app/public_ts/blob/main/packages/sure/esm/core.js
export function sure(insure, meta) {
  return Object.assign(insure, { meta })
}
export function pure(insure) {
  return insure
}
```

### Integrating actual business requirements

In the real world, besides trying to validate strings and number, we sometimes even attempt to
validate things which are specific to our business, like IBANs, national ids, phone numbers from a
particular country, etc.

The main issue that make writing and understanding yup and zod in the previous examples is the way
in which specifying custom requirements is made. Even more so when these requirements change based
on other fields.

Yup handles this using `when()` which _doesn't provide any valid type-safety_. I assume mostly
because the api design was made before Typescript was mainstream. The current version cannot be
retrofitted to allow a property to know about a different property before the whole object schema is
defined. Zod handles this by providing `coerce`, `refine`, `transform`, `superRefine`, `pipe`...

[https://zod.dev/?id=refine](https://zod.dev/?id=refine)

Using Zod for custom scenarios seemed too complex for me.

## Input and output types

When we think about a validation library, there's usually only 1 type we care about. When we write

```ts
import { z, object, string, number } from 'zod'

const something = object({
  name: string(),
  age: number().optional(),
})

type InferSomething = z.infer<typeof something>
```

and we assume that we'd get this type

```ts
type InferSomething = {
  name: string
  age: number | undefined
}
```

But actually, there should be at least 2 types, the input type, and the output type.

By default, the input type is considered `unknown`. But the moment we add refinement or any kind of
piping, the input type is not `unknown` anymore.

Think about:

```ts
import { string } from 'zod'

const nationalId = string().refine(val => val.length === 13 || val === '', {
  message: 'National ID must be 13 digits.',
})
```

We can correctly (almost) assume that the `val` value in the `refine` function is `string`. That
makes implementing the refinement easier since we don't have to check if `val` is a string again.

`io-ts` takes this into account, but good luck convincing your team to use `io-ts` in a React app
with a login form.

### What about the `error` type

The error type always seems completely overlooked. We throw it around, then we catch it, then we try
to figure out what has been thrown and somehow safely integrate it with our `i18n` library.

Any type of switch exhaustiveness or type-safety guarantees are forgotten.

**In my opinion, the error type, is usually MORE important than the expected type.**

I don't even like calling it an "error". We use the issues that arise from validation to guide the
user to a better understanding of what they need to do.

Maybe the user wrote a correct IBAN, but we don't support that bank or that country. We might want
to let them know about that. And I personally would like to know about that before a ticket is
opened by the product team, just relying on Typescript.

The core type in `@robolex/sure` is this:

```ts
export type Sure<
  //
  TBad = unknown,
  TGood = unknown,
  TInput = unknown,
  //
  TMeta extends MetaNever | MetaObj = MetaNever | MetaObj,
> = ((value: TInput) => Good<TGood> | Bad<TBad>) & TMeta
```

Ignore the `Meta` for now. Notice that the `TBad` is the first type parameter. I've specifically
started with this so that I take extra care about what are the type of errors (bad things) that a
validation might return.

## Remember the initial form requirements?

You can check the tests cases and the validation here:
[github.com/nicu-chiciuc/tsx_md/blob/main/apps/validate_form/components/view/form_validation.test.ts](https://github.com/nicu-chiciuc/tsx_md/blob/main/apps/validate_form/components/view/form_validation.test.ts)

Here's a glimpse of the schemas

**Yup**

Good luck reading the docs to understand the order of application of Or if there are any changes
when the order changes.

```
string()
    .required()
    .nullable()
    .transform()
    .test()
    .when(),
```

```ts
import { object, string } from 'yup'
import { isIBAN } from 'validator'

export const FormSchemaYup = object().shape({
  name: string().required('Name is required'),

  iban: string()
    .required()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))

    // check if the iban is valid
    .test('iban', 'IBAN not valid', value => {
      // The empty string got transformed to `null` just for us
      if (value === null) return true

      if (!isIBAN(value, { whitelist: ['MD'] })) return false

      return true
    })

    .when('individual_type', {
      is: 'organization',
      then: schema => schema.required('IBAN is required for organizations'),
      otherwise: schema => schema,
    }),

  individual_type: string()
    .oneOf(
      ['individual', 'organization'],
      `Individual type must either be "individual" or "organization"`
    )
    .required(),
})
```

**Zod**

Sure if better, but if you want to validate a field based on another one, you have to use
`superRefine` which is more complex than `.refine()`.

At least you get better type-safety in the `superRefine`, although when you get to refinements, you
get to the limits of what's safe to do in Zod.

https://github.com/colinhacks/zod/issues/2474

```ts
import { isIBAN } from 'validator'
import { literal, object, string, union } from 'zod'

export const FormSchemaZod = object({
  name: string().nonempty('Name is required.'),

  iban: string().refine(
    value => {
      if (value === '') return true

      if (
        !isIBAN(value, {
          whitelist: ['MD'],
        })
      )
        return false

      return true
    },
    {
      message: 'IBAN not valid',
      path: ['iban'],
    }
  ),

  individual_type: union([literal('individual'), literal('organization')]),
}).superRefine((obj, ctx) => {
  if (obj.individual_type === 'organization' && obj.iban === '') {
    ctx.addIssue({
      code: 'custom',
      message: 'IBAN is required for organizations',
      path: ['iban'],
    })
  }

  return true
})
```

**Sure**

Sure replaces `refine()` with `after()` but the logic is mostly the same. Also, here's the
implementation of `after()`

[https://github.com/robolex-app/public_ts/blob/main/packages/sure/esm/after.js](https://github.com/robolex-app/public_ts/blob/main/packages/sure/esm/after.js)

It's a little harder than `string`, but basically, it runs the first function, and if it's good,
runs the second one. Otherwise, it returns the bad.

It also saves some metadata 🫣

```ts
import { sure, bad } from '@robolex/sure'

export function after(first, second) {
  return sure(
    value => {
      const [good, out] = first(value)
      return good ? second(out) : bad(out)
    },
    {
      first,
      second,
    }
  )
}
```

The schema

```ts
import { after, bad, good, object, pure, InferBad, InferGood } from '@robolex/sure'
import { isIBAN } from 'validator'

const baseSchema = object({
  name: val => {
    if (typeof val === 'string' && val !== '') return good(val)

    return bad('not string')
  },

  iban: value => {
    if (typeof value !== 'string') return bad('not string')
    // allow empty string by default
    if (value === '') return good(value)

    if (!isIBAN(value, { whitelist: ['MD'] })) return bad('not MD iban')

    return good(value)
  },

  individual_type: val => {
    if (val === 'individual' || val === 'organization') return good(val)

    return bad('not individual or organization')
  },
})

// The after function calls the first function, then the second one
// but you can just do it manually if you want
export const FormSchemaSure = after(baseSchema, obj => {
  if (obj.individual_type === 'organization' && obj.iban === '') {
    return bad({ individual_type: 'iban is required for organization' } as const)
  }

  return good(obj)
})

// Hover over the issues type to see what you get
type Issues = InferBad<typeof FormSchemaSure>
```

# Conclusion

Of course, `@robolex/sure` has lots of different helpers for `arrays`, `tuples`, optional keys, etc.
But the main idea is that if something is not defined yet you can easily define it yourself. In my
real-life project I have multiple definitions that are not yet added to the core library, for
example `orUndef` which allows a value to be `undefined`.

> Regarding `optional`, it also supports `exactOptionalPropertyTypes` as compared to `zod` >
> [https://github.com/colinhacks/zod/issues/635]([https://github.com/colinhacks/zod/issues/635])

But all of them are implemented on this minuscule core.

**My general direction was to put ALL the complexity in the type-system and leave the runtime as
simple as humanly possible.**

The generated code is ESM and can be easily understood.

When a library focuses on trying to cover all the simpler use-cases, it often gets to a point where
implementing real, complex use-cases much harder.

`@robolex/sure` is so simple that you can use it as a wrapper around `zod` or `yup` or `io-ts` or
anything else you want.

```ts
import * as y from 'yup'
import { good, bad, Sure, InferGood, InferBad } from '@robolex/sure'

const yupString = (val => {
  try {
    const result = y.string().validateSync(val)
    return good(result)
  } catch (e) {
    if (e instanceof y.ValidationError) {
      return bad(e)
    }
    return bad('some other error')
  }
}) satisfies Sure

// You get correct type inference here
type InferredGood = InferGood<typeof yupString>
type InferredBad = InferBad<typeof yupString>
```

\_

# Final thoughts

There are many, many more things I'd like to talk about, but I've been dragging finishing up this
article for many months now, and I think it's time to publish it.

If you want to read more about `@robolex/sure` (by the way the name is not final, `sure` was already
taken), check out the README.md
[https://github.com/robolex-app/public_ts/](https://github.com/robolex-app/public_ts/)

- There's a long discussion about why I've chosen to represent an `Either` value as a tuple instead
  of and object with a `success` discriminator. Or why not a tuple where the first value is the
  error and the second is the value.

There was a lot of experimentation and tests to get to this minimalistic core.

But that's another story.
