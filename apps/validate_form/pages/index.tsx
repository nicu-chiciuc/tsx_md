import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik'
import * as y from 'yup'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { TheForm } from '@/components/theForm'

const inter = Inter({ subsets: ['latin'] })

/**
- the `name` required text (this one should have lots of tutorials (include link))
- the `national_id` (here it's called IDNO or IDNP) is optional
- an id is a number comprised of 13 digits
- the `individual_type` can either be `"individual"` or `"organization"`
- if the `individual_type` is `'organization"` then the `national_id` is required
 */

const FormSchemaYup = y.object().shape({
  name: y.string().required('Name is required'),

  national_id: y.string().when('individual_type', {
    is: 'organization',
    then: schema =>
      schema.matches(/^\d{13}$/, 'National ID must be 13 digits').required('National ID is required for organizations'),
    otherwise: schema => schema.matches(/^\d{13}$/, 'National ID must be 13 digits'),
  }),

  individual_type: y
    .string()
    .oneOf(['individual', 'organization'], `Individual type must either be "individual" or "organization"`)
    .required(),
})

const FormValue = z.object({
  name: z.string().nonempty('Name is required.'),

  national_id: z.string().refine(val => val.length === 13 || val === '', {
    message: 'National ID must be 13 digits.',
    path: ['national_id'],
  }),

  individual_type: z
    .union([z.literal('individual'), z.literal('organization')])

    // Can't use `refine`  since we need the context
    .refine(
      // @ts-expect-error TODO
      (val, context) => {
        console.log({
          val,
          context,
        })

        if (val === 'organization' && context.parent.national_id === '') {
          return false
        }
        return true
      },
      {
        message: 'National ID is required for organization type.',
        path: ['individual_type'],
      }
    ),
})

const initialValues = {
  name: '',
  national_id: '',
  individual_type: '',
}

export default function Home() {
  const formikYup = useFormik({
    initialValues,
    validationSchema: FormSchemaYup,
    onSubmit: console.log,
  })

  const formikZod = useFormik({
    initialValues,
    validationSchema: FormSchemaYup,
    onSubmit: console.log,
  })

  const formikSure = useFormik({
    initialValues,
    validationSchema: FormSchemaYup,
    onSubmit: console.log,
  })

  return (
    <main className={`flex min-h-screen items-center justify-between p-12 ${inter.className}`}>
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
    </main>
  )
}