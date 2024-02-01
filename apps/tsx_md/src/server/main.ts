import { promises as fs } from 'fs'
import path from 'path'

async function getFilesRecursive(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  console.log(dirents)

  const filesPromises = dirents.map(async dirent => {
    let res = path.resolve(dir, dirent.name)

    if (dirent.isSymbolicLink()) {
      // If it's a symlink, resolve it to the actual path
      res = await fs.realpath(res)
      const stat = await fs.stat(res)
      if (!stat.isDirectory()) {
        return res // If the symlink points to a file, return the file
      }
      // If the symlink points to a directory, continue to recurse
    } else if (!dirent.isDirectory()) {
      return res // If it's a file, return it directly
    }
    // If it's a directory (or a symlink resolved to a directory), recurse into it
    return getFilesRecursive(res)
  })

  const files = await Promise.all(filesPromises)
  return Array.prototype.concat(...files)
}

type FileDir = {
  path: string
  // short: string
  content: string
}

async function readFileContents(files: string[]) {
  const contents: FileDir[] = []
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')

    // /Users/nicu/dev/important/tsx_md/apps/example_node

    const withoutPrefix = file.replace('/Users/nicu/dev/important/tsx_md/apps/example_node', '')

    contents.push({
      path: withoutPrefix,
      // short: withoutPrefix,

      content,
    })
  }
  return contents
}

export const readProjectFiles = async () => {
  // Read all files from `./apps/example_node`
  const projectPath = path.join(process.cwd(), '../../apps/example_node')
  // const files = await fs.readdir(path.join(process.cwd(), '../../apps/example_node'))

  const value = await getFilesRecursive(projectPath)

  const contents = await readFileContents(value)

  const cut = contents.map(data => {
    // remove '/Users/nicu/dev/important/tsx_md/apps/example_node/'

    let withoutPrefix = data.path.replace('/Users/nicu/dev/important/tsx_md/apps/example_node/', '')

    withoutPrefix = withoutPrefix.replace(
      '/Users/nicu/dev/important/tsx_md/node_modules/.pnpm/@robolex+sure@0.9.6/',
      ''
    )

    return {
      small: withoutPrefix,

      ...data,
    }
  })

  return cut
}
