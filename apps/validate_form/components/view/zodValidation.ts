import { isNumeric } from 'validator'
import { literal, object, string, union } from 'zod'

export const FormSchemaZod = object({
  name: string().nonempty('Name is required.'),

  national_id: string().refine(
    value => {
      if (typeof value !== 'string') return false

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
}).refine(obj => {
  console.log({
    obj,
  })

  return true
})
