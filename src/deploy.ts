import * as exec from '@actions/exec'
import * as ioUtil from '@actions/io/lib/io-util'
import { writeFile } from './utils'
import * as path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'
import * as io from '@actions/io'

export async function deploy(
  accessToken: string,
  targetDir: string,
  deployBranch = 'gh-pages',
  dryRun = false
): Promise<void> {
  const currentBranch = github.context.ref?.replace('refs/heads/', '') || 'main'
  if (currentBranch === deployBranch) {
    core.info(`Triggered by branch used to deploy: ${github.context.ref}.`)
    core.info('Nothing to deploy.')
    return
  }

  const cnameExistsInRoot = await ioUtil.exists('./CNAME')
  const cnameExistsInTargetDir = await ioUtil.exists(
    path.join(path.resolve(targetDir), 'CNAME')
  )
  if (cnameExistsInRoot && !cnameExistsInTargetDir) {
    core.info('Copying CNAME over from root directory.')
    await io.cp('./CNAME', `${targetDir}/CNAME`, { force: true })
    core.info(`Finished copying CNAME to ${targetDir}.`)
  }

  const noJekyllPath = path.join(path.resolve(targetDir), '.nojekyll')
  const noJekyllFile = await ioUtil.exists(noJekyllPath)
  if (!noJekyllFile) {
    core.info(`Creating .nojekyll file (${noJekyllPath})`)
    writeFile(noJekyllPath, '')
  }

  const repo = `${github.context.repo.owner}/${github.context.repo.repo}`
  const repoURL = `https://${accessToken}@github.com/${repo}.git`
  core.info('Ready to deploy your static site!')
  core.info(`Deploying to repo: ${repo} and branch: ${deployBranch}`)
  core.info(
    'You can configure the deploy branch by setting the `deploy-branch` input for this action.'
  )

  await exec.exec(`git config`, ['--global', 'init.defaultBranch', 'main'])
  await exec.exec(`git init`, ['-b', 'main'], { cwd: targetDir })
  await exec.exec(`git config user.name`, [github.context.actor], {
    cwd: targetDir
  })
  await exec.exec(
    `git config user.email`,
    [`${github.context.actor}@users.noreply.github.com`],
    {
      cwd: targetDir
    }
  )
  await exec.exec(`git add`, ['.'], { cwd: targetDir })
  await exec.exec(
    `git commit`,
    [
      '-m',
      `deployed via Analog Publish GitHub Pages 🚀 for ${github.context.sha}`
    ],
    {
      cwd: targetDir
    }
  )

  const gitPushArgs = ['-f', repoURL, `${currentBranch}:${deployBranch}`]

  if (dryRun) {
    gitPushArgs.push('--dry-run')
    core.info("dry-run set, It won't actually deploy!")
  }

  await exec.exec(`git push`, gitPushArgs, {
    cwd: targetDir
  })
  core.info('Finished deploying your site. 🚀')
}
