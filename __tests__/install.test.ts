/**
 * Unit tests for src/wait.ts
 */

import { install } from '../src/install'
import { expect } from '@jest/globals'

describe.skip('wait.ts', () => {
  it('throws an invalid number', async () => {
    const input = parseInt('foo', 10)
    expect(isNaN(input)).toBe(true)

    await expect(install('npm')).rejects.toThrow('milliseconds not a number')
  })

  it('waits with a valid number', async () => {
    const start = new Date()
    await install('pnpm')
    const end = new Date()

    const delta = Math.abs(end.getTime() - start.getTime())

    expect(delta).toBeGreaterThan(450)
  })
})
