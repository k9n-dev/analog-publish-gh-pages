import { PackageManager } from './types'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

export async function build(
  packageManager: PackageManager,
  buildArguments = ''
): Promise<void> {
  let buildArgs = buildArguments
  // Add dashes if a user passes args and doesn't have them.
  if (buildArgs !== '' && !buildArgs.startsWith('-- ')) {
    buildArgs = `-- ${buildArgs}`
  }

  core.info('Ready to build your Analog site!')
  core.info(`Building with: ${packageManager} run build ${buildArgs}`)
  await exec.exec(`${packageManager} run build ${buildArgs}`.trim())
  core.info('Finished building your site.')
}
