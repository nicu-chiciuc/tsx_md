import { describe, it, expect } from 'vitest'

import { z } from 'zod'
import * as y from 'yup'
import * as s from '@robolex/sure'

import { FormSchemaSure } from './sureValidation'
import { FormSchemaYup } from './yupValidation'
import { FormSchemaZod } from './zodValidation'
import { isNumeric } from 'validator'

/**
 * Sure doesn't have a backed in function for throwing if the parse fails.
 * Can be implemented like this:
 */
const parseSure = <TGood>([isOk, value]: s.Unsure<unknown, TGood>): TGood => {
  if (isOk) return value

  throw new Error('Sure parse failed ' + JSON.stringify(value))
}

describe('something', () => {
  it('base check, empty string', () => {
    const value = ''

    const isValidZod = z.string().safeParse(value).success
    const isValidYup = y.string().isValidSync(value)
    const [isValidSure] = s.string(value)

    expect(isValidZod).toBe(true)
    expect(isValidYup).toBe(true)
    expect(isValidSure).toBe(true)
  })

  it('now with undefined', () => {
    const value = undefined

    const isValidZod = z.string().safeParse(value).success
    const isValidYup = y.string().isValidSync(value)
    const [isValidSure] = s.string(value)

    expect(isValidZod).toBe(false)
    expect(isValidYup).toBe(true)
    expect(isValidSure).toBe(false)
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

  it('validatorjs', () => {
    // isNumeric is false when the value is an empty string
    expect(isNumeric('', { no_symbols: true })).toBe(false)

    expect(isNumeric('1', { no_symbols: true })).toBe(true)
  })
})
