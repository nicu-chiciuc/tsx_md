import { after, bad, good, object, pure } from '@robolex/sure'
import { isNumeric } from 'validator'

const baseSchema = object({
  name: val => {
    if (typeof val === 'string' && val !== '') return good(val)

    return bad('not string')
  },

  national_id: value => {
    if (typeof value !== 'string') return bad('not string')
    if (!isNumeric(value, { no_symbols: true })) return bad('not numeric string')
    if (value.length !== 13) return bad(`should be 13 digits`)

    return good(value)
  },

  individual_type: val => {
    if (val === 'individual' || val === 'organization') return good(val)

    return bad('not individual or organization')
  },
})

export const FormSchemaSure = after(baseSchema, obj => {
  if (obj.individual_type === 'organization' && obj.national_id === '') {
    return bad({ individual_type: 'national_id is required for organization' })
  }

  return good(obj)
})
