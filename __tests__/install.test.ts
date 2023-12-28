/**
 * Unit tests for src/wait.ts
 */

import { install } from '../src/install'
import { expect } from '@jest/globals'
import * as exec from '@actions/exec'

let execMock: jest.SpyInstance

describe('install.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    execMock = jest.spyOn(exec, 'exec').mockImplementation()
  })

  it('installs with npm', async () => {
    await install('npm')
    expect(execMock).toHaveBeenCalledWith('npm ci')
  })

  it('installs with pnpm', async () => {
    await install('pnpm')
    expect(execMock).toHaveBeenCalledWith('pnpm install --frozen-lockfile')
  })

  it('installs with yarn', async () => {
    await install('yarn')
    expect(execMock).toHaveBeenCalledWith('yarn install --frozen-lockfile')
  })

  it('installs with custom args', async () => {
    await install('npm', '--legacy-peer-deps')
    expect(execMock).toHaveBeenCalledWith('npm ci --legacy-peer-deps')
  })

  it('joins custom args with default args', async () => {
    await install('pnpm', '--legacy-peer-deps')
    expect(execMock).toHaveBeenCalledWith('pnpm install --legacy-peer-deps --frozen-lockfile')
  })

  it('ignores empty string args', async () => {
    await install('npm', '')
    expect(execMock).toHaveBeenCalledWith('npm ci')
  })

  it('removes extra whitespace from args', async () => {
    await install('pnpm', ' --legacy-peer-deps ')
    expect(execMock).toHaveBeenCalledWith('pnpm install --legacy-peer-deps --frozen-lockfile')
  })
})
