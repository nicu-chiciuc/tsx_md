# I need to validate a form

I'm using React (with Next.js)

Formik and Yup were already used in the project.
They are one of most SEOed results.

But I also know about zod, I've used it and like how I get type-safety by default.

----

Now here's a question for you.

I have these requirements and I need to represent them.

### Requirements
* the `name` required text (this one should have lots of tutorials (include link))
* the `national_id` (here it's called IDNO or IDNP) is optional
* an id is a number comprised of 13 digits
* the `individual_type` can either be `"individual"` or `"organization"`
* if the `individual_type` is `'organization"` then the `national_id` is required

so a well formatted form json should look like this:

```ts

type FormValue = {
	name: string
	national_id: string
	individual_type: "individual" | "organization"
}

```

You may think that the `national_id` should be `string | undefined`, but the value of a text form should be `""` (an empty string) by default. So the type would look like this theoretically `string | ""`, but of course Typescript transforms this to `string` automatically.
Of course a solution is `string & {}`. See [What is the purpose of `string & {}`](https://stackoverflow.com/questions/75262513/what-is-the-purpose-of-string)

In case some of the requirements aren't met, the form should contain helpful, custom messages, about the specific issues (not just 'Not number"). These "error" messages might also need i18n in the near future.

---

I've asked ChatGPT 4 (through the API) to write this in Yup.

```ts
import * as yup from 'yup';

const FormSchema = yup.object().shape({
    name: yup.string()
        .required('Name is required'),
    
    national_id: yup.string()
        .when('individual_type', {
            is: 'organization',
            then: yup.string().matches(/^\d{13}$/, 'National ID must be 13 digits').required('National ID is required for organizations'),
            otherwise: yup.string().matches(/^\d{13}$/, 'National ID must be 13 digits')
        }),
        
    individual_type: yup.string()
        .oneOf(['individual', 'organization'], `Individual type must either be "individual" or "organization"`).required(),
});
```

then in Zod

```ts
import { z } from 'zod';

const FormValue = z.object({
	name: z.string().nonempty('Name is required.'),
	national_id: z.string().refine(val => val.length === 13 || val === '', {
		message: "National ID must be 13 digits.",
		path: ['national_id']
	}),
	individual_type: z.union([
		z.literal("individual"),
		z.literal("organization")
    ]).refine((val, ctx) => {
        if (val === 'organization' && ctx.parent.national_id === '') {
            return false;
        }
        return true;
    }, {
        message: "National ID is required for organization type.",
        path: ['individual_type']
    })
});

export type IFormValue = z.infer<typeof FormValue>;
```

Note that our actual form contained ~22 properties (some where just booleans or enums) grouped in some nested objects.

!! review please
Even for such a seemingly small type with 3 properties, the moment we decide to add some actual business requirements, all the beauty of both Zod's and Yup's api go out the window.

## string | '' | undefined
Even for seemigly simple things like `string()`
there are some complex differences:

```ts
import yup from 'yup'
import z from 'zod'

yup.string().required('Name is required'),

// vs

z.string().nonempty('Name is required.'),
```

The main differences between pre-Typescript libraries and post-Typescript (yup and zod) is the way they treat empty strings.

using yup's `string()` without required allows passing `undefined`, '' (empty string) or any other string.
When `string().required()` is used, besides not allowing `undefined`, yup also shows an error for empty strings.

When using `zod` , a `string()` by default allows an empty string and.

The implementation of `yup`'s `string` is this: https://github.com/jquense/yup/blob/master/src/string.ts

The implementation contains 301 lines of code. Most of the functionality (uuid, email) is usually better left for [validator.js](https://github.com/validatorjs/validator.js) since it's more tailored for string validation.

This poses another question, how easy is to use validator.js with yup and zod.

Zod has `refine`, but it's still unintuitive: https://github.com/colinhacks/zod/issues/2192
since it requires deep knowledge on how the system (zod) behaves under the hood.

#### 03
Fortunately, since the requirement that a string is not empty is quite common, zod provides

```ts
import { string } from 'zod'

string().nonempty()
```

Now guess how these libraries behave when `'  '` (a string with just 3 space characters).


## Conditionals and refinements
The main issue that make writing and understanding yup and zod in the previous examples is the way in which specifying custom requirements is made. Even more so when these requirements change based on other fields.

Yup handles this using `when()` which doesn't provide any type of type-inference. I assume mostly because the api design was made before Typescript was mainstream. And the current version is not possible (from my personal understanding), since the reference string needs to be based on the object which causes a cyclical definition and is not possible.

Zod handles this by providing coerce, refine, transform, superRefine, pipe... https://zod.dev/?id=refine
Using Zod for custom scenarios seemed too complex for me.

## What actual type information does Zod/Yup hold
When we think about a validation library there's usually only 1 type we care about.
When we write
```ts
const something = object({
	name: string(),
	age: number().optional()
	})

type InferSomething = Infer<typeof something>

```

and we assume that we'd get this type

```ts
type InferSomething = {
	name: string;
	age: number | undefined
}

```


But actually there should be at least 2 types, the input type, and the output type.

By default the input type is considered `unknown`.
But the moment we add refinement or any kind of piping, the input type is not `unknown` anymore.

Think about:

```ts
national_id: z.string().refine(val => val.length === 13 || val === '', {
		message: "National ID must be 13 digits.",
		path: ['national_id']
	}),

```

We can correctly (almost) assume that the `val` value in the `refine` function is `string`.
That makes implementing the refinement easier since we don't have to check if val is a string again.

	`io-ts` has this `Input` type clearly defined, the i


### What about the `error` type
Even 

## How to validate a `type="date"` input field
https://github.com/colinhacks/zod/discussions/879#discussioncomment-4646183

```ts
const stringToDate = z.string().pipe( z.coerce.date() )
```

here's how to do it in `sure`

```ts
import { pure } from '@robolex/sure'

const dateString = pure(val => {
	if (typeof val === 'string' && <check if datestring>) {
		return good(val)
	}

	return evil('not datestring' as const)
})
```

and you can even do "piping"

```ts
import { sure, after } from '@robolex/sure'

const dateString = after(string, str => {
	return isDate(str) ? good(str) : evl ('not date string' as const)
})
```

the piping is not something added afterwards, it's the main mechanism.