import { PackageManager } from './types'
import * as exec from '@actions/exec'

export async function build(
  packageManager: PackageManager,
  buildArguments = ''
): Promise<void> {
  let buildArgs = buildArguments
  // Add dashes if a user passes args and doesn't have them.
  if (buildArgs !== '' && !buildArgs.startsWith('-- ')) {
    buildArgs = `-- ${buildArgs}`
  }

  console.log('Ready to build your Analog site!')
  console.log(`Building with: ${packageManager} run build ${buildArgs}`)
  await exec.exec(`${packageManager} run build ${buildArgs}`.trim(), [])
  console.log('Finished building your site.')
}
