'use client'

import * as Devtools from './ReactKeysDevtools'
import * as plugin from './plugin'

export const KeysDevtoolsPanel =
  process.env.NODE_ENV !== 'development'
    ? Devtools.KeysDevtoolsPanelNoOp
    : Devtools.KeysDevtoolsPanel

export const keysDevtoolsPlugin =
  process.env.NODE_ENV !== 'development'
    ? plugin.keysDevtoolsNoOpPlugin
    : plugin.keysDevtoolsPlugin

export type { KeysDevtoolsReactInit } from './ReactKeysDevtools'
