import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'

export function readFile(filePath: string): string {
  const resolvedPath = path.resolve(filePath)
  core.debug(`Reading file: ${resolvedPath}`)

  // Check if the file exists
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found: ${resolvedPath}`)
  }
  return fs.readFileSync(resolvedPath, 'utf8')
}

export function writeFile(filePath: string, data: string): void {
  const resolvedPath = path.resolve(filePath)
  core.debug(`Writing file: ${resolvedPath}`)
  return fs.writeFileSync(resolvedPath, data)
}

export function removeFileIfExists(filePath: string): void {
  const resolvedPath = path.resolve(filePath)
  if (fs.existsSync(resolvedPath)) {
    core.debug(`Removing file: ${resolvedPath}`)
    fs.rmSync(resolvedPath)
  }
  return
}
