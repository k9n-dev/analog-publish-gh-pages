import * as exec from '@actions/exec'
import * as ioUtil from '@actions/io/lib/io-util'
import { readFile, writeFile } from './utils'
import * as path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'

export async function deploy(
  accessToken: string,
  targetDir: string,
  deployArguments = ''
): Promise<void> {
  let deployArgs = deployArguments
  // Add dashes if a user passes args and doesn't have them.
  if (deployArgs !== '' && !deployArguments.startsWith('-- ')) {
    deployArgs = `${deployArguments}`
  }
  deployArgs = deployArgs ? ` ${deployArgs}` : ''

  let cnameArg = ''
  const cnameFile = await ioUtil.exists('CNAME')
  if (cnameFile) {
    const cname = readFile('CNAME')
    cnameArg = ` --cname=${cname}`
  }

  const noJekyllPath = path.join(path.resolve(targetDir), '.nojekyll')

  const noJekyllFile = await ioUtil.exists(noJekyllPath)
  if (!noJekyllFile) {
    core.info(`Creating .nojekyll file (${noJekyllPath})`)
    writeFile(noJekyllPath, '')
  }

  const repo = `${github.context.repo.owner}/${github.context.repo.repo}`
  const repoURL = `https://${accessToken}@github.com/${repo}.git`

  await exec.exec(`git config user.name`, [github.context.actor])
  await exec.exec(`git config user.email`, [
    `${github.context.actor}@users.noreply.github.com`
  ])

  core.info(`Deploy static site using angular-cli-ghpages`)
  await exec.exec(
    `npx angular-cli-ghpages --repo="${repoURL}" --dir="${targetDir}"${cnameArg}${deployArgs}`
  )
  core.info('Successfully deployed your site.')
}
