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
