import { InferGood, object, optional, string } from '@robolex/sure'

export const sureArticleFrontmatter = object({
  title: string,
  description: string,
  status: optional(string),
})

export const assertArticleFrontmatter = (data: unknown): SureArticleFrontmatter => {
  const [ok, value] = sureArticleFrontmatter(data)

  if (!ok) {
    throw new Error('Invalid article frontmatter: ' + JSON.stringify(data))
  }

  return value
}

export type SureArticleFrontmatter = InferGood<typeof sureArticleFrontmatter>
