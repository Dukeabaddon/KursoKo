// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import {
  resolveScrollTopForElement,
  resolveSectionScrollAnchor,
} from '../../src/utils/smoothScroll.js'

describe('resolveSectionScrollAnchor', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('prefers landing-section__inner over outer section', () => {
    const section = document.createElement('section')
    section.id = 'how'
    const inner = document.createElement('div')
    inner.setAttribute('data-landing-inner', '')
    section.appendChild(inner)
    document.body.appendChild(section)

    expect(resolveSectionScrollAnchor(section)).toBe(inner)
  })
})

describe('resolveScrollTopForElement', () => {
  beforeEach(() => {
    vi.stubGlobal('innerHeight', 900)
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 5000,
    })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('align start uses inner top below nav offset', () => {
    const section = document.createElement('section')
    const inner = document.createElement('div')
    inner.setAttribute('data-landing-inner', '')
    section.appendChild(inner)
    document.body.appendChild(section)

    inner.getBoundingClientRect = () => ({
      top: 420,
      bottom: 1220,
      height: 800,
      width: 0,
      left: 0,
      right: 0,
      x: 0,
      y: 420,
      toJSON: () => ({}),
    })
    Object.defineProperty(inner, 'offsetHeight', { value: 800 })

    const top = resolveScrollTopForElement(section, { align: 'start', navOffset: 72 })
    expect(top).toBe(348)
  })

  it('align center on tall inner keeps top band in upper-middle viewport', () => {
    vi.stubGlobal('innerHeight', 900)

    const section = document.createElement('section')
    const inner = document.createElement('div')
    inner.setAttribute('data-landing-inner', '')
    section.appendChild(inner)
    document.body.appendChild(section)

    inner.getBoundingClientRect = () => ({
      top: 2400,
      bottom: 3600,
      height: 1200,
      width: 0,
      left: 0,
      right: 0,
      x: 0,
      y: 2400,
      toJSON: () => ({}),
    })
    Object.defineProperty(inner, 'offsetHeight', { value: 1200 })

    const top = resolveScrollTopForElement(section, { align: 'center', navOffset: 72 })
    // inner top at 32% of 900 = 288; scroll = 2400 - 288 = 2112
    expect(top).toBe(2112)
  })

  it('align center uses inner vertical middle when inner is short', () => {
    const section = document.createElement('section')
    const inner = document.createElement('div')
    inner.setAttribute('data-landing-inner', '')
    section.appendChild(inner)
    document.body.appendChild(section)

    inner.getBoundingClientRect = () => ({
      top: 1200,
      bottom: 1700,
      height: 500,
      width: 0,
      left: 0,
      right: 0,
      x: 0,
      y: 1200,
      toJSON: () => ({}),
    })
    Object.defineProperty(inner, 'offsetHeight', { value: 500 })

    const top = resolveScrollTopForElement(section, { align: 'center', navOffset: 72 })
    expect(top).toBe(1000)
  })
})
