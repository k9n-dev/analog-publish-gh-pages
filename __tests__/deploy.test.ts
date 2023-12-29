import { deploy } from '../src/deploy'
import { expect } from '@jest/globals'
import * as exec from '@actions/exec'
import { removeFileIfExists, writeFile } from '../src/utils'
import * as ioUtil from '@actions/io/lib/io-util'

let execMock: jest.SpyInstance

const deployDir = '__tests__'

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
    await deploy(deployDir)
    expect(execMock).toHaveBeenCalledWith(
      `npx angular-cli-ghpages --dir=\"${deployDir}\"`
    )
  })

  it('deploys with deploy args', async () => {
    await deploy(deployDir, '--no-silent')
    expect(execMock).toHaveBeenCalledWith(
      `npx angular-cli-ghpages --dir=\"${deployDir}\" --no-silent`
    )
  })

  it('deploys with cname arg from file', async () => {
    writeFile('CNAME', 'example.org')
    await deploy(deployDir)
    expect(execMock).toHaveBeenCalledWith(
      `npx angular-cli-ghpages --dir=\"${deployDir}\" --cname=example.org`
    )
  })

  it('creates a .nojekyll file in the target directory', async () => {
    await deploy(deployDir)
    const noJekyllFile = await ioUtil.exists(`${deployDir}/.nojekyll`)
    expect(noJekyllFile).toBe(true)
  })
})
