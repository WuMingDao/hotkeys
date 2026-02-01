// =============================================================================
// Modifier Types
// =============================================================================

/**
 * All supported modifier key names, including aliases.
 * - Control/Ctrl: The Control key
 * - Shift: The Shift key
 * - Alt/Option: The Alt key (Option on macOS)
 * - Command/Cmd: The Command key (macOS only)
 * - CommandOrControl/Mod: Command on macOS, Control on other platforms
 */
export type Modifier =
  | 'Control'
  | 'Ctrl'
  | 'Shift'
  | 'Alt'
  | 'Option'
  | 'Command'
  | 'Cmd'
  | 'CommandOrControl'
  | 'Mod'

/**
 * Canonical modifier names that map to KeyboardEvent properties.
 */
export type CanonicalModifier = 'Control' | 'Shift' | 'Alt' | 'Meta'

// =============================================================================
// Key Types
// =============================================================================

/**
 * Letter keys A-Z (case-insensitive in matching).
 */
export type LetterKey =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'

/**
 * Number keys 0-9.
 */
export type NumberKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'

/**
 * Function keys F1-F12.
 */
export type FunctionKey =
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12'

/**
 * Navigation keys for cursor movement.
 */
export type NavigationKey =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown'

/**
 * Editing and special keys.
 */
export type EditingKey =
  | 'Enter'
  | 'Escape'
  | 'Space'
  | 'Tab'
  | 'Backspace'
  | 'Delete'

/**
 * Punctuation keys commonly used in keyboard shortcuts.
 * These are the literal characters as they appear in KeyboardEvent.key
 * (layout-dependent, typically US keyboard layout).
 */
export type PunctuationKey =
  | '/'
  | '['
  | ']'
  | '\\'
  | '='
  | '-'
  | ','
  | '.'
  | '`'

/**
 * Keys that don't change their value when Shift is pressed.
 * These keys produce the same `KeyboardEvent.key` value whether Shift is held or not.
 *
 * Excludes NumberKey (Shift+1 produces '!' on US layout) and PunctuationKey
 * (Shift+',' produces '<' on US layout).
 *
 * Used in hotkey type definitions to prevent layout-dependent issues when Shift
 * is part of the modifier combination.
 */
type ShiftUnaffectedKey = LetterKey | EditingKey | NavigationKey | FunctionKey

/**
 * Keys whose value changes when Shift is pressed.
 * These keys produce different `KeyboardEvent.key` values when Shift is held.
 *
 * Examples:
 * - NumberKey: Shift+1 → '!' (on US layout)
 * - PunctuationKey: Shift+',' → '<' (on US layout)
 *
 * These keys are excluded from Shift-based hotkey combinations to avoid
 * layout-dependent behavior, but can be used with other modifiers (Control, Alt, Meta, Mod).
 */
type ShiftAffectedKey = NumberKey | PunctuationKey

/**
 * All supported non-modifier keys.
 */
export type Key = ShiftUnaffectedKey | ShiftAffectedKey

/**
 * Keys that can be tracked as "held" (pressed down).
 * Includes both modifier keys and regular keys.
 */
export type HeldKey = CanonicalModifier | Key

// =============================================================================
// Hotkey Types
// =============================================================================

/**
 * Single modifier + key combinations.
 * Uses canonical modifiers (4) + Mod (1) = 5 modifiers.
 * Shift combinations exclude PunctuationKey to avoid layout-dependent issues.
 */
type SingleModifierHotkey =
  | `Control+${Key}`
  | `Alt+${Key}`
  | `Shift+${ShiftUnaffectedKey}`
  | `Meta+${Key}`
  | `Mod+${Key}`

/**
 * Two modifier + key combinations.
 * Shift combinations exclude PunctuationKey to avoid layout-dependent issues.
 */
type TwoModifierHotkey =
  | `Control+Alt+${Key}`
  | `Control+Shift+${ShiftUnaffectedKey}`
  | `Control+Meta+${Key}`
  | `Alt+Shift+${ShiftUnaffectedKey}`
  | `Alt+Meta+${Key}`
  | `Shift+Meta+${ShiftUnaffectedKey}`
  | `Mod+Alt+${Key}`
  | `Mod+Shift+${ShiftUnaffectedKey}`
  | `Mod+Control+${Key}`
  | `Mod+Meta+${Key}`

/**
 * Three modifier + key combinations.
 * Shift combinations exclude PunctuationKey to avoid layout-dependent issues.
 */
type ThreeModifierHotkey =
  | `Control+Alt+Shift+${ShiftUnaffectedKey}`
  | `Control+Alt+Meta+${Key}`
  | `Control+Shift+Meta+${ShiftUnaffectedKey}`
  | `Alt+Shift+Meta+${ShiftUnaffectedKey}`
  | `Mod+Alt+Shift+${ShiftUnaffectedKey}`
  | `Mod+Control+Shift+${ShiftUnaffectedKey}`
  | `Mod+Shift+Meta+${ShiftUnaffectedKey}`

/**
 * A type-safe hotkey string.
 *
 * Provides autocomplete for:
 * - All single keys (letters, numbers, function keys, navigation, editing, punctuation)
 * - Single modifier + common key (Control+S, Mod+A, Mod+/, etc.)
 * - Two modifiers + common key (Mod+Shift+S, Control+Alt+A, etc.)
 * - Three modifiers + common key (Control+Alt+Shift+A, etc.)
 *
 * Use canonical modifier names:
 * - `Control` (not Ctrl)
 * - `Alt` (not Option)
 * - `Meta` (not Command/Cmd)
 * - `Mod` for cross-platform (Command on Mac, Control elsewhere)
 *
 * @example
 * ```ts
 * const save: Hotkey = 'Mod+S'           // ✓ Cross-platform save
 * const saveAs: Hotkey = 'Mod+Shift+S'   // ✓ Cross-platform save as
 * const macOnly: Hotkey = 'Meta+S'       // ✓ Command+S on Mac only
 * const comment: Hotkey = 'Mod+/'       // ✓ Toggle comment
 * const indent: Hotkey = 'Mod+]'        // ✓ Indent
 * ```
 */
export type Hotkey =
  | Key
  | SingleModifierHotkey
  | TwoModifierHotkey
  | ThreeModifierHotkey

/**
 * A parsed representation of a hotkey string.
 *
 * This interface provides a flexible fallback when the `Hotkey` type doesn't
 * fit your use case. You can pass a `ParsedHotkey` directly to hotkey functions
 * instead of a hotkey string, allowing for more dynamic or complex scenarios
 * that aren't covered by the type-safe `Hotkey` union.
 *
 * @example
 * ```ts
 * // Type-safe hotkey string
 * useHotkey('Mod+S', handler)
 *
 * // Fallback: parsed hotkey for dynamic scenarios
 * const parsed = parseHotkey(userInput)
 * useHotkey(parsed, handler) // Works even if userInput isn't in Hotkey type
 * ```
 */
export interface ParsedHotkey {
  /** The non-modifier key (e.g., 'S', 'Escape', 'F1', '/', '['). Can be any string for flexibility. */
  key: Key & (string | {})
  /** Whether the Control key is required */
  ctrl: boolean
  /** Whether the Shift key is required */
  shift: boolean
  /** Whether the Alt key is required */
  alt: boolean
  /** Whether the Meta (Command) key is required */
  meta: boolean
  /** List of canonical modifier names that are required, in canonical order */
  modifiers: Array<CanonicalModifier>
}

/**
 * Options for formatting hotkeys for display.
 */
export interface FormatDisplayOptions {
  /** The target platform. Defaults to auto-detection. */
  platform?: 'mac' | 'windows' | 'linux'
}

/**
 * Result of validating a hotkey string.
 */
export interface ValidationResult {
  /** Whether the hotkey is valid (can still have warnings) */
  valid: boolean
  /** Warning messages about potential issues */
  warnings: Array<string>
  /** Error messages about invalid syntax */
  errors: Array<string>
}

// =============================================================================
// Callback Types
// =============================================================================

/**
 * Context passed to hotkey callbacks along with the keyboard event.
 */
export interface HotkeyCallbackContext {
  /** The original hotkey string that was registered */
  hotkey: Hotkey
  /** The parsed representation of the hotkey */
  parsedHotkey: ParsedHotkey
}

/**
 * Callback function type for hotkey handlers.
 *
 * @param event - The keyboard event that triggered the hotkey
 * @param context - Additional context including the hotkey and parsed hotkey
 *
 * @example
 * ```ts
 * const handler: HotkeyCallback = (event, { hotkey, parsedHotkey }) => {
 *   console.log(`Hotkey ${hotkey} was pressed`)
 *   console.log(`Modifiers:`, parsedHotkey.modifiers)
 * }
 * ```
 */
export type HotkeyCallback = (
  event: KeyboardEvent,
  context: HotkeyCallbackContext,
) => void

// =============================================================================
// Options Types
// =============================================================================

/**
 * Options for registering a hotkey.
 */
export interface HotkeyOptions {
  /** Prevent the default browser action when the hotkey matches */
  preventDefault?: boolean
  /** Stop event propagation when the hotkey matches */
  stopPropagation?: boolean
  /** The target platform for resolving 'Mod' */
  platform?: 'mac' | 'windows' | 'linux'
  /** The event type to listen for. Defaults to 'keydown' */
  eventType?: 'keydown' | 'keyup'
  /** If true, only trigger once until all keys are released. Default: false */
  requireReset?: boolean
  /** Whether the hotkey is enabled. Defaults to true */
  enabled?: boolean
}

// =============================================================================
// Sequence Types
// =============================================================================

/**
 * A sequence of hotkeys for Vim-style shortcuts.
 *
 * @example
 * ```ts
 * const gotoTop: HotkeySequence = ['G', 'G']  // gg
 * const deleteLine: HotkeySequence = ['D', 'D']  // dd
 * const deleteWord: HotkeySequence = ['D', 'I', 'W']  // diw
 * ```
 */
export type HotkeySequence = Array<Hotkey>

/**
 * Options for hotkey sequence matching.
 */
export interface SequenceOptions extends HotkeyOptions {
  /** Timeout between keys in milliseconds. Default: 1000 */
  timeout?: number
}

// =============================================================================
// Registration Types
// =============================================================================

/**
 * A registered hotkey handler in the HotkeyManager.
 */
export interface HotkeyRegistration {
  /** Unique identifier for this registration */
  id: string
  /** The original hotkey string */
  hotkey: Hotkey
  /** The parsed hotkey */
  parsedHotkey: ParsedHotkey
  /** The callback to invoke */
  callback: HotkeyCallback
  /** Options for this registration */
  options: HotkeyOptions
  /** Whether this registration has fired and needs reset (for requireReset) */
  hasFired: boolean
}
