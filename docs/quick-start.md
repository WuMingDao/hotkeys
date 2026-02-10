# Quick Start

## Core Usage

```typescript
import { createTemplate } from '@tanstack/hotkeys'

const keys = createTemplate({ message: 'Hello!' })
keys.greet() // Logs: Hello!
```

## React Usage

```tsx
import { createTemplate } from '@tanstack/hotkeys'
import { useTemplate } from '@tanstack/react-hotkeys'

function App() {
  const keys = React.useMemo(() => createTemplate(), [])
  const state = useTemplate(keys)

  return <div>{state.message}</div>
}
```

## Solid Usage

```tsx
import { createTemplate } from '@tanstack/hotkeys'
import { createTemplateSignal } from '@tanstack/solid-hotkeys'

function App() {
  const keys = createTemplate()
  const state = createTemplateSignal(keys)

  return <div>{state().message}</div>
}
```

## With Devtools

### React

```tsx
import { TemplateDevtools } from '@tanstack/react-hotkeys-devtools'

function App() {
  // ... your code

  return (
    <div>
      {/* your app */}
      <TemplateDevtools />
    </div>
  )
}
```

### Solid

```tsx
import { TemplateDevtools } from '@tanstack/solid-hotkeys-devtools'

function App() {
  // ... your code

  return (
    <div>
      {/* your app */}
      <TemplateDevtools />
    </div>
  )
}
```
