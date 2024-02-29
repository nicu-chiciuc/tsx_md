import { after, bad, good, object, pure } from '@robolex/sure'
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

export const FormSchemaSure = after(baseSchema, obj => {
  if (obj.individual_type === 'organization' && obj.iban === '') {
    return bad({ individual_type: 'iban is required for organization' })
  }

  return good(obj)
})
