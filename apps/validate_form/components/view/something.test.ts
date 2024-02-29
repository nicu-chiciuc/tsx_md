import { describe, it, expect } from 'vitest'

import { z } from 'zod'
import * as y from 'yup'
import * as s from '@robolex/sure'

import { FormSchemaSure } from './sureValidation'
import { FormSchemaYup } from './yupValidation'
import { FormSchemaZod } from './zodValidation'

/**
 * Sure doesn't have a backed in function for throwing if the parse fails.
 * Can be implemented like this:
 */
const parseSure = <TGood>([isOk, value]: s.Unsure<unknown, TGood>): TGood => {
  if (isOk) return value

  throw new Error('Sure parse failed ' + JSON.stringify(value))
}

describe('something', () => {
  it('empty string', () => {
    const value = ''

    const isValidZod = z.string().safeParse(value).success
    expect(isValidZod).toBe(true)

    // Yup doesn't seem to have non-throws
    const isValidYup = y.string().required().isValidSync(value)
    expect(isValidYup).toBe(false) // Not sure what's a simple way to allow empty strings

    const [isValidSure] = s.string(value)
    expect(isValidSure).toBe(true)
  })

  it('string | undfined', () => {
    const value = undefined

    const isValidZod = z.string().or(z.undefined()).safeParse(value).success
    expect(isValidZod).toBe(true)

    const isValidYup = y.string().isValidSync(value)
    expect(isValidYup).toBe(true)

    const [isValidSure] = s.or(s.string, s.undef)(value)
    expect(isValidSure).toBe(true)
  })
})
