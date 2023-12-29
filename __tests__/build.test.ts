import { build } from '../src/build'
import { expect } from '@jest/globals'
import * as exec from '@actions/exec'

let execMock: jest.SpyInstance

describe('build.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    execMock = jest.spyOn(exec, 'exec').mockImplementation()
  })

  it('builds with passed package manager', async () => {
    await build('npm')
    expect(execMock).toHaveBeenCalledWith('npm run build')
  })

  it('builds with build args', async () => {
    await build('npm', '--configuration=development')
    expect(execMock).toHaveBeenCalledWith(
      'npm run build -- --configuration=development'
    )
  })

  it('removes extra "--"', async () => {
    await build('npm', '-- -c=development --dry-run')
    expect(execMock).toHaveBeenCalledWith(
      'npm run build -- -c=development --dry-run'
    )
  })
})
