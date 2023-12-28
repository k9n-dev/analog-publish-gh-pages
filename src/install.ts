import { PackageManager } from './types'
import * as exec from '@actions/exec'

export async function install(
  packageManager: PackageManager,
  installArgs = ''
): Promise<void> {
  let installCommand = 'ci'
  let installOptions = [installArgs]
  if (packageManager !== 'npm') {
    installOptions.push('--frozen-lockfile')
    installCommand = 'install'
  }

  console.log(`Installing your site's dependencies using ${packageManager}.`)
  await exec.exec(
    `${packageManager} ${installCommand} ${installOptions.join(' ')}`
  )
  console.log('Finished installing dependencies.')
}
