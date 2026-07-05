import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { DEV_DARK_MODE_NOTICE, devLog, logDevPageNotice } from '../../src/utils/devLogger.js'

describe('devLogger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exports dark mode dev notice text', () => {
    expect(DEV_DARK_MODE_NOTICE).toContain('no dark mode')
  })

  it('logDevPageNotice logs styled message', () => {
    logDevPageNotice('home')
    expect(console.log).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  it('devLog is a function', () => {
    expect(typeof devLog).toBe('function')
  })
})
