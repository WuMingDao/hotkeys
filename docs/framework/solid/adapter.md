# Solid Adapter

The Solid adapter provides primitives for using Keys in Solid applications.

## createTemplateSignal

The `createTemplateSignal` primitive connects a Keys instance to Solid's reactivity system.

```tsx
import { createTemplateSignal } from '@tanstack/solid-hotkeys'

function MyComponent() {
  const keys = createTemplate()
  const state = createTemplateSignal(keys)

  return <div>{state().message}</div>
}
```

### Parameters

- `keys`: Keys - The keys instance to connect

### Returns

Returns a Solid signal containing the current state from the keys's store.

## Examples

See the `/examples/solid/` directory for complete working examples:
- `basic` - Simple usage example
- `devtools` - Example with devtools integration
