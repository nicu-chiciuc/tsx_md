import { object, string } from 'yup'

export const FormSchemaYup = object().shape({
  name: string().required('Name is required'),

  national_id: string()
    .nullable()
    .matches(/^\d{13}$/, 'National ID must be 13 digits')
    .transform((curr, orig) => (orig === '' ? null : curr))
    .when('individual_type', {
      is: 'organization',
      then: schema => schema.required('National ID is required for organizations'),
      otherwise: schema => schema,
    }),

  individual_type: string()
    .oneOf(['individual', 'organization'], `Individual type must either be "individual" or "organization"`)
    .required(),
})
