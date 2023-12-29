import * as core from '@actions/core'
import * as main from '../src/main'

const runMock = jest.spyOn(main, 'run')
let setFailedMock: jest.SpyInstance
let getInputMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
  })

  it('sets the input values', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'package-manager':
          return 'pnpm'
        case 'access-token':
          return '1234'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()
    expect(getInputMock).toHaveNthReturnedWith(1, "pnpm")
    expect(getInputMock).toHaveNthReturnedWith(2, "1234")
  })

  it('sets a failed status when package manager is not set', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'package-manager':
          return ''
        case 'access-token':
          return '1234'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Package Manager must be either \"npm\", \"yarn\" or \"pnpm\". Please set a valid value by setting the `package-manager` input for this action.'
    )
  })

  it('sets a failed status when package manager is not set', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'package-manager':
          return 'npm'
        case 'access-token':
          return ''
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'No personal access token found. Please provide one by setting the `access-token` input for this action.'
    )
  })
})
