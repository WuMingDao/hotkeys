import { useEffect, useRef } from 'react'
import { getHotkeyManager } from '@tanstack/keys'
import type {
  Hotkey,
  HotkeyCallback,
  HotkeyOptions,
  ParsedHotkey,
} from '@tanstack/keys'

export interface UseHotkeyOptions extends Omit<HotkeyOptions, 'enabled' | 'target'> {
  /** Whether the hotkey is enabled. Defaults to true. */
  enabled?: boolean
  /** The DOM element or React ref to attach the event listener to. Defaults to document. */
  target?:
  | React.RefObject<HTMLElement | null>
  | HTMLElement
  | Document
  | Window
  | null
  | undefined
}

/**
 * React hook for registering a keyboard hotkey.
 *
 * Uses the singleton HotkeyManager for efficient event handling.
 * The callback receives both the keyboard event and a context object
 * containing the hotkey string and parsed hotkey.
 *
 * @param hotkey - The hotkey string (e.g., 'Mod+S', 'Escape')
 * @param callback - The function to call when the hotkey is pressed
 * @param options - Options for the hotkey behavior
 *
 * @example
 * ```tsx
 * function SaveButton() {
 *   useHotkey('Mod+S', (event, { hotkey, parsedHotkey }) => {
 *     console.log(`${hotkey} was pressed`)
 *     handleSave()
 *   }, { preventDefault: true })
 *
 *   return <button>Save</button>
 * }
 * ```
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   // Only active when modal is open
 *   useHotkey('Escape', () => {
 *     onClose()
 *   }, { enabled: isOpen })
 *
 *   if (!isOpen) return null
 *   return <div className="modal">...</div>
 * }
 * ```
 *
 * @example
 * ```tsx
 * function Editor() {
 *   // Prevent repeated triggering while holding
 *   useHotkey('Mod+S', () => {
 *     save()
 *   }, { preventDefault: true, requireReset: true })
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useHotkey(
  hotkey: Hotkey | ParsedHotkey,
  callback: HotkeyCallback,
  options: UseHotkeyOptions = {},
): void {
  const { enabled = true, ...hotkeyOptions } = options

  // Extract options for stable dependencies
  const {
    preventDefault,
    stopPropagation,
    platform,
    eventType,
    requireReset,
    ignoreInputs,
    target,
  } = hotkeyOptions

  // Use refs to keep callback and hotkey stable across renders
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const hotkeyRef = useRef(hotkey)
  hotkeyRef.current = hotkey

  // Serialize hotkey for dependency comparison
  const hotkeyKey = typeof hotkey === 'string' ? hotkey : JSON.stringify(hotkey)

  // Resolve target for dependency tracking
  // For refs, we need to check current value, but we can't put ref.current in deps directly
  // So we'll resolve it inside the effect and track the resolved value
  const targetRef = useRef(target)
  targetRef.current = target

  // Track resolved target to detect when ref.current changes
  const resolvedTargetRef = useRef<HTMLElement | Document | Window | null>(
    null,
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    // Resolve target: handle refs, elements, or default to document
    let resolvedTarget: HTMLElement | Document | Window | null = null

    const currentTarget = targetRef.current

    if (currentTarget) {
      // Check if it's a React ref
      if (
        typeof currentTarget === 'object' &&
        'current' in currentTarget &&
        currentTarget.current !== null &&
        currentTarget.current instanceof HTMLElement
      ) {
        resolvedTarget = currentTarget.current
      } else if (
        currentTarget instanceof HTMLElement ||
        currentTarget === document ||
        currentTarget === window
      ) {
        // It's already a DOM element
        resolvedTarget = currentTarget
      }
    }

    // Default to document if no target provided or ref is null
    if (!resolvedTarget && typeof document !== 'undefined') {
      resolvedTarget = document
    }

    // Skip if target is still null (SSR)
    if (!resolvedTarget) {
      return
    }

    // Check if target has changed (important for refs)
    const previousTarget = resolvedTargetRef.current
    if (previousTarget === resolvedTarget) {
      // Target hasn't changed, but we still need to re-register if other deps changed
      // This will be handled by the unregister/register cycle below
    }

    const hotkeyValue = hotkeyRef.current
    const hotkeyString: Hotkey =
      typeof hotkeyValue === 'string'
        ? hotkeyValue
        : formatParsedHotkey(hotkeyValue)

    const manager = getHotkeyManager()

    // Build options object, only including defined values to avoid
    // overwriting manager defaults with undefined
    const registerOptions: HotkeyOptions = {
      enabled: true,
      target: resolvedTarget,
    } as HotkeyOptions
    if (preventDefault !== undefined)
      registerOptions.preventDefault = preventDefault
    if (stopPropagation !== undefined)
      registerOptions.stopPropagation = stopPropagation
    if (platform !== undefined) registerOptions.platform = platform
    if (eventType !== undefined) registerOptions.eventType = eventType
    if (requireReset !== undefined) registerOptions.requireReset = requireReset
    if (ignoreInputs !== undefined) registerOptions.ignoreInputs = ignoreInputs

    const unregister = manager.register(
      hotkeyString,
      (event, context) => callbackRef.current(event, context),
      registerOptions,
    )

    // Track the resolved target
    resolvedTargetRef.current = resolvedTarget

    return unregister
  }, [
    enabled,
    preventDefault,
    stopPropagation,
    platform,
    eventType,
    requireReset,
    ignoreInputs,
    hotkeyKey,
    // Note: For refs, changes to ref.current won't trigger this effect.
    // This is a React limitation - refs don't trigger re-renders.
    // Users should ensure their component re-renders when ref.current changes
    // if they need the hotkey to update (e.g., by using state).
    target,
  ])
}

/**
 * Formats a ParsedHotkey back to a hotkey string.
 */
function formatParsedHotkey(parsed: ParsedHotkey): Hotkey {
  const parts: Array<string> = []

  if (parsed.ctrl) parts.push('Control')
  if (parsed.alt) parts.push('Alt')
  if (parsed.shift) parts.push('Shift')
  if (parsed.meta) parts.push('Meta')
  parts.push(parsed.key)

  return parts.join('+') as Hotkey
}
