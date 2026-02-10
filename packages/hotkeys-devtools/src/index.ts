'use client'

import * as Devtools from './core'

export const KeysDevtoolsCore =
  process.env.NODE_ENV !== 'development'
    ? Devtools.KeysDevtoolsCoreNoOp
    : Devtools.KeysDevtoolsCore

export type { KeysDevtoolsInit } from './core'
