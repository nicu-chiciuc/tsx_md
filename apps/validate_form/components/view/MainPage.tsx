import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik'
import * as y from 'yup'
import { z } from 'zod'
import * as r from '@robolex/sure'
import { Button } from '@/components/ui/button'
import { TheForm } from './theForm'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { FormSchemaYup } from './yupValidation'
import { FormSchemaZod } from './zodValidation'

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

export default function MainPage() {
  const formikYup = useFormik({
    initialValues,
    validationSchema: FormSchemaYup,
    onSubmit: console.log,
  })

  const formikZod = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(FormSchemaZod),
    onSubmit: console.log,
  })

  const formikSure = useFormik({
    initialValues,
    validationSchema: FormSchemaYup,
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
