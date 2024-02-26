import { object, string } from 'yup'

export const FormSchemaYup = object().shape({
  name: string().required('Name is required'),

  national_id: string().when('individual_type', {
    is: 'organization',
    then: schema =>
      schema.matches(/^\d{13}$/, 'National ID must be 13 digits').required('National ID is required for organizations'),
    otherwise: schema => schema.matches(/^\d{13}$/, 'National ID must be 13 digits'),
  }),

  individual_type: string()
    .oneOf(['individual', 'organization'], `Individual type must either be "individual" or "organization"`)
    .required(),
})
