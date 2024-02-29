import { useFormik } from 'formik'
import { Button } from '@/components/ui/button'

type FormikObj = typeof useFormik<{
  name: string
  iban: string
  individual_type: string
}>

export function TheForm({ formik }: { formik: ReturnType<FormikObj> }) {
  return (
    <form onSubmit={formik.handleSubmit} className="flex w-96 flex-col gap-3">
      {/* Name */}
      <div className="flex flex-col border border-gray-600 p-2">
        <label htmlFor="name">Name</label>
        <input
          className="border-2 border-black"
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />

        <span className="text-red-500">{formik.errors.name && formik.touched.name && formik.errors.name}</span>
      </div>

      {/* National ID */}
      <div className="flex flex-col border border-gray-600 p-2">
        <label htmlFor="iban">National ID</label>
        <input
          className="border-2 border-black"
          name="iban"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.iban}
        />

        <span className="text-red-500">{formik.errors.iban && formik.touched.iban && formik.errors.iban}</span>
      </div>

      {/* Individual type */}
      <div className="flex flex-col border border-gray-600 p-2">
        <label htmlFor="individual_type">Individual Type</label>
        <input
          className="border-2 border-black"
          name="individual_type"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.individual_type}
        />

        <span className="text-red-500">
          {formik.errors.individual_type && formik.touched.individual_type && formik.errors.individual_type}
        </span>
      </div>

      <Button type="submit" disabled={formik.isSubmitting}>
        Submit
      </Button>
    </form>
  )
}
