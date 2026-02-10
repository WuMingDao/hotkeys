import { For, Show } from 'solid-js'
import { formatKeyForDebuggingDisplay } from '@tanstack/hotkeys'
import { useStyles } from '../styles/use-styles'
import { useKeysDevtoolsState } from '../KeysContextProvider'

export function HeldKeysBar() {
  const styles = useStyles()
  const state = useKeysDevtoolsState()

  return (
    <div class={styles().heldKeysBar}>
      <span class={styles().heldKeysBarHeader}>Held</span>
      <div class={styles().heldKeysBarList}>
        <Show
          when={state.heldKeys().length > 0}
          fallback={<span class={styles().noKeysHeld}>--</span>}
        >
          <For each={state.heldKeys()}>
            {(key) => {
              const code = () => state.heldCodes()[key]
              const label = () => formatKeyForDebuggingDisplay(key)
              const codeLabel = () => {
                const c = code()
                return c
                  ? formatKeyForDebuggingDisplay(c, { source: 'code' })
                  : undefined
              }
              return (
                <span class={styles().keyCap}>
                  <span>{label()}</span>
                  <Show when={codeLabel() && codeLabel() !== key}>
                    <span class={styles().keyCapCode}>{codeLabel()}</span>
                  </Show>
                </span>
              )
            }}
          </For>
        </Show>
      </div>
    </div>
  )
}
