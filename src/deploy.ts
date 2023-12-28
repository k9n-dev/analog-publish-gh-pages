import { PackageManager } from './types'
import * as exec from '@actions/exec'
import * as ioUtil from '@actions/io/lib/io-util'
import * as fs from 'fs'

export async function deploy(
  targetDir: string,
  deployArgs = ''
): Promise<void> {
  let cnameArg = ''
  const cnameFile = await ioUtil.exists('CNAME')
  if (cnameFile) {
    const cname = fs.readFileSync('CNAME', 'utf8')
    cnameArg = `--cname=${cname}`
  }

  console.log(`Deploy static site using angular-cli-ghpages`)
  await exec.exec(
    `npx angular-cli-ghpages --dir="${targetDir}" ${cnameArg} ${deployArgs}`
  )
  console.log('Successfully deployed your site.')
}
