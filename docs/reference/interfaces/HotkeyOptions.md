---
id: HotkeyOptions
title: HotkeyOptions
---

# Interface: HotkeyOptions

Defined in: [hotkey-manager.ts:25](https://github.com/TanStack/keys/blob/main/packages/hotkeys/src/hotkey-manager.ts#L25)

Options for registering a hotkey.

## Extended by

- [`SequenceOptions`](SequenceOptions.md)

## Properties

### conflictBehavior?

```ts
optional conflictBehavior: ConflictBehavior;
```

Defined in: [hotkey-manager.ts:43](https://github.com/TanStack/keys/blob/main/packages/hotkeys/src/hotkey-manager.ts#L43)

Behavior when this hotkey conflicts with an existing registration on the same target. Defaults to 'warn'

***

### enabled?

```ts
optional enabled: boolean;
```

Defined in: [hotkey-manager.ts:27](https://github.com/TanStack/keys/blob/main/packages/hotkeys/src/hotkey-manager.ts#L27)

Whether the hotkey is enabled. Defaults to true

***

### eventType?

```ts
optional eventType: "keydown" | "keyup";
```

Defined in: [hotkey-manager.ts:29](https://github.com/TanStack/keys/blob/main/packages/hotkeys/src/hotkey-manager.ts#L29)

The event type to listen for. Defaults to 'keydown'

***

### ignoreInputs?

```ts
optional ignoreInputs: boolean;
```

Defined in: [hotkey-manager.ts:31](https://github.com/TanStack/keys/blob/main/packages/hotkeys/src/hotkey-manager.ts#L31)

Whether to ignore hotkeys when keyboard events originate from input-like elements (input, textarea, select, contenteditable). Defaults to true

***

### platform?

```ts
optional platform: "mac" | "windows" | "linux";
```

Defined in: [hotkey-manager.ts:33](https://github.com/TanStack/keys/blob/main/packages/hotkeys/src/hotkey-manager.ts#L33)

The target platform for resolving 'Mod'

***

### preventDefault?

```ts
optional preventDefault: boolean;
```

Defined in: [hotkey-manager.ts:35](https://github.com/TanStack/keys/blob/main/packages/hotkeys/src/hotkey-manager.ts#L35)

Prevent the default browser action when the hotkey matches

***

### requireReset?

```ts
optional requireReset: boolean;
```

Defined in: [hotkey-manager.ts:37](https://github.com/TanStack/keys/blob/main/packages/hotkeys/src/hotkey-manager.ts#L37)

If true, only trigger once until all keys are released. Default: false

***

### stopPropagation?

```ts
optional stopPropagation: boolean;
```

Defined in: [hotkey-manager.ts:39](https://github.com/TanStack/keys/blob/main/packages/hotkeys/src/hotkey-manager.ts#L39)

Stop event propagation when the hotkey matches

***

### target?

```ts
optional target: Document | Window | HTMLElement | null;
```

Defined in: [hotkey-manager.ts:41](https://github.com/TanStack/keys/blob/main/packages/hotkeys/src/hotkey-manager.ts#L41)

The DOM element to attach the event listener to. Defaults to document.
