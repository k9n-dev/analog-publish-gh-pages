import { PackageManager } from './types'
import * as exec from '@actions/exec'

export async function install(
  packageManager: PackageManager,
  installArgs = ''
): Promise<void> {
  let installCommand = 'ci'
  let installArgsWhitespaceStripped = installArgs.trim()
  let installOptions = installArgsWhitespaceStripped ? [installArgsWhitespaceStripped] : []
  if (packageManager !== 'npm') {
    installOptions.push('--frozen-lockfile')
    installCommand = 'install'
  }

  console.log(`Installing your site's dependencies using ${packageManager}.`)
  await exec.exec(
    `${packageManager} ${installCommand} ${installOptions.join(' ')}`.trim()
  )
  console.log('Finished installing dependencies.')
}
