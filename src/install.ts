import { PackageManager } from './types'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

export async function install(
  packageManager: PackageManager,
  installArgs = ''
): Promise<void> {
  let installCommand = 'ci'
  let installArgsWhitespaceStripped = installArgs.trim()
  let installOptions = installArgsWhitespaceStripped
    ? [installArgsWhitespaceStripped]
    : []
  if (packageManager !== 'npm') {
    installOptions.push('--frozen-lockfile')
    installCommand = 'install'
  }

  core.info(`Installing your site's dependencies using ${packageManager}.`)
  await exec.exec(
    `${packageManager} ${installCommand} ${installOptions.join(' ')}`.trim()
  )
  core.info('Finished installing dependencies.')
}
