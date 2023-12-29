import * as core from '@actions/core'
import { install } from './install'
import { PackageManager } from './types'
import { build } from './build'
import { deploy } from './deploy'

export async function run(): Promise<void> {
  try {
    const packageManager: string = core.getInput('package-manager')
    if (!packageManager || !['npm', 'yarn', 'pnpm'].includes(packageManager)) {
      return core.setFailed(
        'Package Manager must be either "npm", "yarn" or "pnpm". Please set a valid value by setting the `package-manager` input for this action.'
      )
    }

    const accessToken: string = core.getInput('access-token', {})
    if (!accessToken) {
      return core.setFailed(
        'No personal access token found. Please provide one by setting the `access-token` input for this action.'
      )
    }

    const installArgs = core.getInput('install-args')?.trim() || ''
    const buildArgs = core.getInput('build-args')?.trim() || ''
    const deployDir =
      core.getInput('deploy-dir')?.trim() || 'dist/analog/public'
    const deployArgs = core.getInput('deploy-args')?.trim() || '--no-silent'

    core.startGroup('Install')
    await install(packageManager as PackageManager, installArgs)
    core.endGroup()

    core.startGroup('Build')
    await build(packageManager as PackageManager, buildArgs)
    core.endGroup()

    core.startGroup('Deploy')
    await deploy(deployDir, deployArgs)
    core.endGroup()

    core.info('Enjoy! ✨')
    core.setOutput('success', true)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
