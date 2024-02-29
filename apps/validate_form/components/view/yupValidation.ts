import { object, string } from 'yup'
import { isIBAN } from 'validator'

export const FormSchemaYup = object().shape({
  name: string().required('Name is required'),

  iban: string()
    .required()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))

    // check if the iban is valid
    .test('iban', 'IBAN not valid', value => {
      // The empty string got transformed to `null` just for us
      if (value === null) return true

      if (!isIBAN(value, { whitelist: ['MD'] })) return false

      return true
    })

    .when('individual_type', {
      is: 'organization',
      then: schema => schema.required('National ID is required for organizations'),
      otherwise: schema => schema,
    }),

  individual_type: string()
    .oneOf(['individual', 'organization'], `Individual type must either be "individual" or "organization"`)
    .required(),
})
