import {beforeEach, describe, expect, it} from 'vitest'
import {Config} from '../../services'
import {InstanceAlreadyExists, MissingHolographConfig} from '../../errors'
import {localhostRpc, testConfigObject} from '../setup'
import {Environment} from '@holographxyz/environment'

describe('Service: Config', () => {
  beforeEach(() => {
    resetConfig()
  })

  it('should throw an error when requesting the instance without prior instantiation', () => {
    expect(() => Config.getInstance()).toThrow(MissingHolographConfig)
  })

  it('should return a new instance when initialized for the first time with valid configuration', () => {
    const config = Config.getInstance(testConfigObject)
    expect(config).toBeInstanceOf(Config)
  })

  it('should return the same instance when initialized again with a different configuration', () => {
    const firstInstance = Config.getInstance(testConfigObject)
    const secondInstance = Config.getInstance({
      networks: {
        localhost: localhostRpc,
      },
      environment: Environment.localhost,
    })
    expect(firstInstance).toBe(secondInstance)
  })

  it('should return the existing instance when requested after initial instantiation', () => {
    const initialInstance = Config.getInstance(testConfigObject)
    const requestedInstance = Config.getInstance()
    expect(requestedInstance).toBe(initialInstance)
  })
})

function resetConfig() {
  Config['_instance'] = undefined // Resetting for test purposes; an instance already exists from the test setup
}
