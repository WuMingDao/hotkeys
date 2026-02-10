import { KeysContextProvider } from './KeysContextProvider'
import { Shell } from './components/Shell'

export default function KeysDevtools() {
  return (
    <KeysContextProvider>
      <Shell />
    </KeysContextProvider>
  )
}
