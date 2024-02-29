import { isNumeric } from 'validator'
import { literal, object, string, union } from 'zod'

export const FormSchemaZod = object({
  name: string().nonempty('Name is required.'),

  national_id: string().refine(
    value => {
      if (value === '') return true

      if (!isNumeric(value, { no_symbols: true })) return false

      if (value.length !== 13) return false

      return true
    },
    {
      message: 'National ID must be 13 digits.',
      path: ['national_id'],
    }
  ),

  individual_type: union([literal('individual'), literal('organization')]),
}).superRefine((obj, ctx) => {
  if (obj.individual_type === 'organization' && obj.national_id === '') {
    ctx.addIssue({
      code: 'custom',
      message: 'National ID is required for organizations.',
      path: ['national_id'],
    })
  }

  return true
})
