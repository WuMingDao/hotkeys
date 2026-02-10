import { createReactPanel } from '@tanstack/devtools-utils/react'
import { KeysDevtoolsCore } from '@tanstack/hotkeys-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'

export interface KeysDevtoolsReactInit extends DevtoolsPanelProps {}

const [KeysDevtoolsPanel, KeysDevtoolsPanelNoOp] =
  createReactPanel(KeysDevtoolsCore)

export { KeysDevtoolsPanel, KeysDevtoolsPanelNoOp }
