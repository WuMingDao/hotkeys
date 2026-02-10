import { For, Show, createMemo } from 'solid-js'
import { formatForDisplay } from '@tanstack/hotkeys'
import { useStyles } from '../styles/use-styles'
import { useKeysDevtoolsState } from '../KeysContextProvider'
import { ActionButtons } from './ActionButtons'
import type { ConflictBehavior, HotkeyRegistration } from '@tanstack/hotkeys'

type DetailsPanelProps = {
  selectedRegistration: () => HotkeyRegistration | null
}

function getTargetDescription(target: HTMLElement | Document | Window): string {
  if (typeof document !== 'undefined' && target === document) {
    return 'document'
  }
  if (typeof window !== 'undefined' && target === window) {
    return 'window'
  }
  if (target instanceof HTMLElement) {
    const tag = target.tagName.toLowerCase()
    const id = target.id ? `#${target.id}` : ''
    const cls = target.className
      ? `.${target.className.split(' ').join('.')}`
      : ''
    return `${tag}${id}${cls}`
  }
  return 'element'
}

function findTargetConflicts(
  registration: HotkeyRegistration,
  all: Array<HotkeyRegistration>,
): Array<HotkeyRegistration> {
  return all.filter(
    (other) =>
      other.id !== registration.id &&
      other.hotkey === registration.hotkey &&
      other.options.eventType === registration.options.eventType &&
      other.target === registration.target,
  )
}

function findScopeConflicts(
  registration: HotkeyRegistration,
  all: Array<HotkeyRegistration>,
): Array<HotkeyRegistration> {
  return all.filter(
    (other) =>
      other.id !== registration.id &&
      other.hotkey === registration.hotkey &&
      other.options.eventType === registration.options.eventType &&
      other.target !== registration.target,
  )
}

function getConflictItemStyle(
  behavior: ConflictBehavior,
  isSameTarget: boolean,
):
  | 'conflictItem'
  | 'conflictItemAllow'
  | 'conflictItemError'
  | 'conflictItemScope' {
  if (!isSameTarget) return 'conflictItemScope'
  if (behavior === 'allow') return 'conflictItemAllow'
  if (behavior === 'error') return 'conflictItemError'
  return 'conflictItem'
}

function getConflictLabel(
  behavior: ConflictBehavior,
  isSameTarget: boolean,
): string {
  if (!isSameTarget) return 'scope'
  if (behavior === 'allow') return 'allowed'
  if (behavior === 'error') return 'error'
  if (behavior === 'replace') return 'replaced'
  return 'warning'
}

export function DetailsPanel(props: DetailsPanelProps) {
  const styles = useStyles()
  const state = useKeysDevtoolsState()

  return (
    <div class={styles().stateDetails}>
      <Show
        when={props.selectedRegistration()}
        fallback={
          <div class={styles().noSelection}>
            Select a hotkey from the list to view its details
          </div>
        }
      >
        {(reg) => {
          const parsed = () => reg().parsedHotkey
          const targetConflicts = createMemo(() =>
            findTargetConflicts(reg(), state.registrations()),
          )
          const scopeConflicts = createMemo(() =>
            findScopeConflicts(reg(), state.registrations()),
          )
          const allConflicts = createMemo(() => [
            ...targetConflicts(),
            ...scopeConflicts(),
          ])
          const conflictBehavior = (): ConflictBehavior =>
            reg().options.conflictBehavior ?? 'warn'

          // Build key parts for visual breakdown
          const keyParts = createMemo(() => {
            const parts: Array<string> = []
            const p = parsed()
            if (p.ctrl) parts.push('Ctrl')
            if (p.shift) parts.push('Shift')
            if (p.alt) parts.push('Alt')
            if (p.meta) parts.push('Meta')
            parts.push(p.key)
            return parts
          })

          return (
            <>
              <div class={styles().stateHeader}>
                <div class={styles().stateTitle}>
                  {formatForDisplay(reg().hotkey)}
                </div>
                <div class={styles().infoGrid}>
                  <div class={styles().infoLabel}>ID</div>
                  <div class={styles().infoValueMono}>{reg().id}</div>
                  <div class={styles().infoLabel}>Raw</div>
                  <div class={styles().infoValueMono}>{reg().hotkey}</div>
                  <div class={styles().infoLabel}>Target</div>
                  <div class={styles().infoValueMono}>
                    {getTargetDescription(reg().target)}
                  </div>
                </div>
              </div>

              <div class={styles().detailsGrid}>
                {/* Key Breakdown */}
                <div class={styles().detailSection}>
                  <div class={styles().detailSectionHeader}>Key Breakdown</div>
                  <div class={styles().keyBreakdown}>
                    <For each={keyParts()}>
                      {(part, i) => (
                        <>
                          <Show when={i() > 0}>
                            <span class={styles().keyBreakdownPlus}>+</span>
                          </Show>
                          <span class={styles().keyCapLarge}>{part}</span>
                        </>
                      )}
                    </For>
                  </div>
                </div>

                {/* Actions */}
                <div class={styles().detailSection}>
                  <div class={styles().detailSectionHeader}>Actions</div>
                  <ActionButtons registration={reg()} />
                </div>

                {/* Options */}
                <div class={styles().detailSection}>
                  <div class={styles().detailSectionHeader}>Options</div>
                  <div>
                    <div class={styles().optionRow}>
                      <span class={styles().optionLabel}>enabled</span>
                      <span
                        class={
                          reg().options.enabled !== false
                            ? styles().optionValueTrue
                            : styles().optionValueFalse
                        }
                      >
                        {String(reg().options.enabled !== false)}
                      </span>
                    </div>
                    <div class={styles().optionRow}>
                      <span class={styles().optionLabel}>eventType</span>
                      <span class={styles().optionValue}>
                        {reg().options.eventType ?? 'keydown'}
                      </span>
                    </div>
                    <div class={styles().optionRow}>
                      <span class={styles().optionLabel}>preventDefault</span>
                      <span
                        class={
                          reg().options.preventDefault
                            ? styles().optionValueTrue
                            : styles().optionValueFalse
                        }
                      >
                        {String(!!reg().options.preventDefault)}
                      </span>
                    </div>
                    <div class={styles().optionRow}>
                      <span class={styles().optionLabel}>stopPropagation</span>
                      <span
                        class={
                          reg().options.stopPropagation
                            ? styles().optionValueTrue
                            : styles().optionValueFalse
                        }
                      >
                        {String(!!reg().options.stopPropagation)}
                      </span>
                    </div>
                    <div class={styles().optionRow}>
                      <span class={styles().optionLabel}>ignoreInputs</span>
                      <span
                        class={
                          reg().options.ignoreInputs !== false
                            ? styles().optionValueTrue
                            : styles().optionValueFalse
                        }
                      >
                        {String(reg().options.ignoreInputs !== false)}
                      </span>
                    </div>
                    <div class={styles().optionRow}>
                      <span class={styles().optionLabel}>requireReset</span>
                      <span
                        class={
                          reg().options.requireReset
                            ? styles().optionValueTrue
                            : styles().optionValueFalse
                        }
                      >
                        {String(!!reg().options.requireReset)}
                      </span>
                    </div>
                    <div class={styles().optionRow}>
                      <span class={styles().optionLabel}>conflictBehavior</span>
                      <span class={styles().optionValue}>
                        {conflictBehavior()}
                      </span>
                    </div>
                    <div class={styles().optionRow}>
                      <span class={styles().optionLabel}>hasFired</span>
                      <span
                        class={
                          reg().hasFired
                            ? styles().optionValueTrue
                            : styles().optionValueFalse
                        }
                      >
                        {String(reg().hasFired)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conflicts */}
                <Show when={allConflicts().length > 0}>
                  <div class={styles().detailSection}>
                    <div class={styles().detailSectionHeader}>
                      Conflicts ({allConflicts().length})
                    </div>
                    <div class={styles().conflictList}>
                      <For each={targetConflicts()}>
                        {(conflict) => {
                          const itemStyle = () =>
                            getConflictItemStyle(conflictBehavior(), true)
                          const label = () =>
                            getConflictLabel(conflictBehavior(), true)
                          return (
                            <div class={styles()[itemStyle()]}>
                              <span>{label()}</span> {conflict.id}:{' '}
                              {formatForDisplay(conflict.hotkey)} (
                              {conflict.options.eventType ?? 'keydown'}) on{' '}
                              {getTargetDescription(conflict.target)}
                            </div>
                          )
                        }}
                      </For>
                      <For each={scopeConflicts()}>
                        {(conflict) => (
                          <div class={styles().conflictItemScope}>
                            <span>scope</span> {conflict.id}:{' '}
                            {formatForDisplay(conflict.hotkey)} (
                            {conflict.options.eventType ?? 'keydown'}) on{' '}
                            {getTargetDescription(conflict.target)}
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </Show>
              </div>
            </>
          )
        }}
      </Show>
    </div>
  )
}
