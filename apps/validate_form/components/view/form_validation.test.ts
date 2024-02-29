import { describe, it, expect } from 'vitest'

import { z } from 'zod'
import * as y from 'yup'
import * as s from '@robolex/sure'

import { FormSchemaSure } from './sureValidation'
import { FormSchemaYup } from './yupValidation'
import { FormSchemaZod } from './zodValidation'

function checkAll(value: unknown, expected: boolean, showErrors = false) {
  const zodResult = FormSchemaZod.safeParse(value)
  const isValidYup = FormSchemaYup.isValidSync(value)
  const [isValidSure, result] = FormSchemaSure(value)

  if (showErrors) {
    if (!zodResult.success) {
      console.log('zod: ', zodResult.error)
    }

    if (!isValidYup) {
      console.log({ isValidYup })
      try {
        FormSchemaYup.validateSync(value)
      } catch (e) {
        console.log('yup: ', e)
      }
    }

    if (!isValidSure) {
      console.log('sure: ', result)
    }
  }

  expect(zodResult.success).toBe(expected)
  expect(isValidYup).toBe(expected)
  expect(isValidSure).toBe(expected)
}

describe('validat the schema', () => {
  it('base check, empty string', () => {
    const value = {
      name: '',
      national_id: '',
      individual_type: '',
    }

    checkAll(value, false)
  })

  it('individual with no id', () => {
    const value = {
      name: 'John',
      national_id: '',
      individual_type: 'individual',
    }

    checkAll(value, true, true)
  })

  it('individual with id', () => {
    const value = {
      name: 'John',
      national_id: '1234567890123',
      individual_type: 'individual',
    }

    checkAll(value, true)
  })

  it('individual with bad id', () => {
    const value = {
      name: 'John',
      national_id: '123456789012',
      individual_type: 'individual',
    }

    checkAll(value, false)
  })

  it('organization with no id', () => {
    const value = {
      name: 'John',
      national_id: '',
      individual_type: 'organization',
    }

    checkAll(value, false)
  })

  it('organization with id', () => {
    const value = {
      name: 'John',
      national_id: '1234567890123',
      individual_type: 'organization',
    }

    checkAll(value, true)
  })

  it('organization with bad id', () => {
    const value = {
      name: 'John',
      national_id: '123456789012',
      individual_type: 'organization',
    }

    checkAll(value, false)
  })
})
