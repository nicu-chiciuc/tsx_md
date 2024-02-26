import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik'
import * as y from 'yup'
import { z } from 'zod'
import * as r from '@robolex/sure'
import { Button } from '@/components/ui/button'
import { TheForm } from './theForm'
import { toFormikValidate, toFormikValidationSchema } from 'zod-formik-adapter'
import { FormSchemaYup } from './yupValidation'
import { FormSchemaZod } from './zodValidation'
import { FormSchemaSure } from './sureValidation'

/**
- the `name` required text (this one should have lots of tutorials (include link))
- the `national_id` (here it's called IDNO or IDNP) is optional
- an id is a number comprised of 13 digits
- the `individual_type` can either be `"individual"` or `"organization"`
- if the `individual_type` is `'organization"` then the `national_id` is required
 */

const initialValues = {
  name: '',
  national_id: '',
  individual_type: '',
}

// Copied from: https://github.com/robertLichtnow/zod-formik-adapter/blob/master/index.ts
function createValidationResult(error: z.ZodError) {
  const result: Record<string, string> = {}

  for (const x of error.errors) {
    result[x.path.filter(Boolean).join('.')] = x.message
  }

  return result
}

export default function MainPage() {
  const formikYup = useFormik({
    initialValues,
    validationSchema: FormSchemaYup,
    onSubmit: console.log,
  })

  const formikZod = useFormik({
    initialValues,
    validate: formValue => {
      const result = FormSchemaZod.safeParse(formValue)

      if (!result.success) return createValidationResult(result.error)
    },
    onSubmit: console.log,
  })

  const formikSure = useFormik({
    initialValues,
    validationSchema: FormSchemaYup,
    validate: formValue => {
      const [isValid, value] = FormSchemaSure(formValue)

      if (!isValid) return value
    },
    onSubmit: console.log,
  })

  return (
    <div className="flex h-full w-full justify-between gap-6">
      <div>
        <span>Using Yup</span>
        <TheForm formik={formikYup} />
      </div>

      <div>
        <span>Using Zod</span>
        <TheForm formik={formikZod} />
      </div>

      <div>
        <span>Using Sure</span>
        <TheForm formik={formikSure} />
      </div>
    </div>
  )
}
