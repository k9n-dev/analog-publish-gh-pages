import { deploy } from '../src/deploy'
import { expect } from '@jest/globals'
import * as exec from '@actions/exec'
import { removeFileIfExists, writeFile } from '../src/utils'
import * as ioUtil from '@actions/io/lib/io-util'

let execMock: jest.SpyInstance

const deployDir = '__tests__'

process.env.GITHUB_REPOSITORY = 'my-org/my-repo'

describe('deploy.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    execMock = jest.spyOn(exec, 'exec').mockImplementation()
  })

  // cleanup temp files
  afterEach(() => {
    removeFileIfExists(`${deployDir}/.nojekyll`)
    removeFileIfExists(`${deployDir}/CNAME`)
    removeFileIfExists(`CNAME`)
  })

  it('deploys', async () => {
    await deploy('1234', deployDir)
    expect(execMock).toHaveBeenNthCalledWith(
      6,
      'git push',
      [
        '-f',
        'origin',
        'https://1234@github.com/my-org/my-repo.git',
        'main:gh-pages'
      ],
      { cwd: '__tests__' }
    )
  })

  it('creates a CNAME file in the target directory', async () => {
    writeFile('CNAME', '')
    await deploy('1234', deployDir)
    const CNAMEFile = await ioUtil.exists(`${deployDir}/CNAME`)
    expect(CNAMEFile).toBe(true)
  })

  it('creates a .nojekyll file in the target directory', async () => {
    await deploy('1234', deployDir)
    const noJekyllFile = await ioUtil.exists(`${deployDir}/.nojekyll`)
    expect(noJekyllFile).toBe(true)
  })
})
