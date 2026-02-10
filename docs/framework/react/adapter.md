# React Adapter

The React adapter provides hooks for using Keys in React applications.

## useTemplate

The `useTemplate` hook connects a Keys instance to React's reactivity system.

```tsx
import { useTemplate } from '@tanstack/react-hotkeys'

function MyComponent() {
  const keys = React.useMemo(() => createTemplate(), [])
  const state = useTemplate(keys)

  return <div>{state.message}</div>
}
```

### Parameters

- `keys`: Keys - The keys instance to connect

### Returns

Returns the current state from the keys's store.

## Examples

See the `/examples/react/` directory for complete working examples:
- `basic` - Simple usage example
- `devtools` - Example with devtools integration
