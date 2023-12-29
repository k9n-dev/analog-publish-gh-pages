import { deploy } from '../src/deploy'
import { expect } from '@jest/globals'
import * as exec from '@actions/exec'
import { removeFileIfExists, writeFile } from '../src/utils'
import * as ioUtil from '@actions/io/lib/io-util'

let execMock: jest.SpyInstance

const deployDir = '__tests__'

process.env.GITHUB_REPOSITORY = 'https://github.com/my-org/my-repo'

describe('deploy.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    execMock = jest.spyOn(exec, 'exec').mockImplementation()
  })

  // cleanup temp files
  afterEach(() => {
    removeFileIfExists(`${deployDir}/.nojekyll`)
    removeFileIfExists('CNAME')
  })

  it('deploys the passed directory', async () => {
    await deploy('1234', deployDir)
    expect(execMock).toHaveBeenCalledWith(
      `npx angular-cli-ghpages --repo="https://1234@github.com/https:/.git" --dir="${deployDir}"`
    )
  })

  it('deploys with deploy args', async () => {
    await deploy('1234', deployDir, '--no-silent')
    expect(execMock).toHaveBeenCalledWith(
      `npx angular-cli-ghpages --repo="https://1234@github.com/https:/.git" --dir="${deployDir}" --no-silent`
    )
  })

  it('deploys with cname arg from file', async () => {
    writeFile('CNAME', 'example.org')
    await deploy('1234', deployDir)
    expect(execMock).toHaveBeenCalledWith(
      `npx angular-cli-ghpages --repo="https://1234@github.com/https:/.git" --dir="${deployDir}" --cname=example.org`
    )
  })

  it('creates a .nojekyll file in the target directory', async () => {
    await deploy('1234', deployDir)
    const noJekyllFile = await ioUtil.exists(`${deployDir}/.nojekyll`)
    expect(noJekyllFile).toBe(true)
  })
})
