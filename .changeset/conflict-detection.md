---
'@tanstack/hotkeys': minor
---

Add hotkey conflict detection with configurable behavior

Implements conflict detection when registering hotkeys with the same combination on the same target. Adds a new `conflictBehavior` option to `HotkeyOptions`:

- `'warn'` (default) - Log a warning to console but allow both registrations
- `'error'` - Throw an error and prevent the new registration
- `'replace'` - Unregister the existing hotkey and register the new one
- `'allow'` - Allow multiple registrations without warning

This addresses the "Warn/error on conflicting shortcuts (TBD)" item from the README.
