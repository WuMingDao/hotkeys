import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SequenceManager, createSequenceMatcher } from '../src/sequence'

/**
 * Helper to create and dispatch a KeyboardEvent
 */
function dispatchKey(key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, bubbles: true })
  document.dispatchEvent(event)
  return event
}

describe('SequenceManager', () => {
  beforeEach(() => {
    SequenceManager.resetInstance()
    vi.useFakeTimers()
  })

  afterEach(() => {
    SequenceManager.resetInstance()
    vi.useRealTimers()
  })

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = SequenceManager.getInstance()
      const instance2 = SequenceManager.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('sequence registration', () => {
    it('should register a sequence', () => {
      const manager = SequenceManager.getInstance()
      const callback = vi.fn()

      manager.register(['G', 'G'], callback)

      expect(manager.getRegistrationCount()).toBe(1)
    })

    it('should unregister a sequence', () => {
      const manager = SequenceManager.getInstance()
      const callback = vi.fn()

      const unregister = manager.register(['G', 'G'], callback)
      expect(manager.getRegistrationCount()).toBe(1)

      unregister()
      expect(manager.getRegistrationCount()).toBe(0)
    })

    it('should throw for empty sequence', () => {
      const manager = SequenceManager.getInstance()
      expect(() => manager.register([], vi.fn())).toThrow()
    })
  })

  describe('sequence matching', () => {
    it('should trigger callback when sequence is completed', () => {
      const manager = SequenceManager.getInstance()
      const callback = vi.fn()

      manager.register(['G', 'G'], callback)

      dispatchKey('g')
      expect(callback).not.toHaveBeenCalled()

      dispatchKey('g')
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should pass context to callback', () => {
      const manager = SequenceManager.getInstance()
      const callback = vi.fn()

      manager.register(['D', 'D'], callback)

      dispatchKey('d')
      dispatchKey('d')

      expect(callback).toHaveBeenCalledWith(
        expect.any(KeyboardEvent),
        expect.objectContaining({
          hotkey: 'D D',
        }),
      )
    })

    it('should reset on wrong key', () => {
      const manager = SequenceManager.getInstance()
      const callback = vi.fn()

      manager.register(['G', 'G'], callback)

      dispatchKey('g')
      dispatchKey('x') // Wrong key
      dispatchKey('g') // Start over
      expect(callback).not.toHaveBeenCalled()

      dispatchKey('g')
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should restart sequence if first key of sequence is pressed', () => {
      const manager = SequenceManager.getInstance()
      const callback = vi.fn()

      manager.register(['G', 'G'], callback)

      dispatchKey('g')
      dispatchKey('g')
      expect(callback).toHaveBeenCalledTimes(1)

      // Press g g again
      dispatchKey('g')
      dispatchKey('g')
      expect(callback).toHaveBeenCalledTimes(2)
    })
  })

  describe('timeout', () => {
    it('should reset sequence after timeout', () => {
      const manager = SequenceManager.getInstance()
      const callback = vi.fn()

      manager.register(['G', 'G'], callback, { timeout: 500 })

      dispatchKey('g')
      vi.advanceTimersByTime(600) // Exceed timeout
      dispatchKey('g')

      expect(callback).not.toHaveBeenCalled()
    })

    it('should complete sequence within timeout', () => {
      const manager = SequenceManager.getInstance()
      const callback = vi.fn()

      manager.register(['G', 'G'], callback, { timeout: 500 })

      dispatchKey('g')
      vi.advanceTimersByTime(400) // Within timeout
      dispatchKey('g')

      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('longer sequences', () => {
    it('should match three-key sequences', () => {
      const manager = SequenceManager.getInstance()
      const callback = vi.fn()

      manager.register(['D', 'I', 'W'], callback)

      dispatchKey('d')
      dispatchKey('i')
      expect(callback).not.toHaveBeenCalled()

      dispatchKey('w')
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})

describe('createSequenceMatcher', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should match sequence', () => {
    const matcher = createSequenceMatcher(['G', 'G'])

    const event1 = new KeyboardEvent('keydown', { key: 'g' })
    expect(matcher.match(event1)).toBe(false)
    expect(matcher.getProgress()).toBe(1)

    const event2 = new KeyboardEvent('keydown', { key: 'g' })
    expect(matcher.match(event2)).toBe(true)
    expect(matcher.getProgress()).toBe(0) // Reset after match
  })

  it('should reset on wrong key', () => {
    const matcher = createSequenceMatcher(['G', 'G'])

    matcher.match(new KeyboardEvent('keydown', { key: 'g' }))
    expect(matcher.getProgress()).toBe(1)

    matcher.match(new KeyboardEvent('keydown', { key: 'x' }))
    expect(matcher.getProgress()).toBe(0)
  })

  it('should reset manually', () => {
    const matcher = createSequenceMatcher(['G', 'G'])

    matcher.match(new KeyboardEvent('keydown', { key: 'g' }))
    expect(matcher.getProgress()).toBe(1)

    matcher.reset()
    expect(matcher.getProgress()).toBe(0)
  })

  it('should respect timeout', () => {
    const matcher = createSequenceMatcher(['G', 'G'], { timeout: 500 })

    matcher.match(new KeyboardEvent('keydown', { key: 'g' }))
    vi.advanceTimersByTime(600)

    expect(matcher.match(new KeyboardEvent('keydown', { key: 'g' }))).toBe(
      false,
    )
    expect(matcher.getProgress()).toBe(1) // Started new sequence
  })
})
