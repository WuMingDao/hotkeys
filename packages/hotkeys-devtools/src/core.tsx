import { constructCoreClass } from '@tanstack/devtools-utils/solid'
import { lazy } from 'solid-js'

const Component = lazy(() => import('./KeysDevtools'))

export interface KeysDevtoolsInit {}

const [KeysDevtoolsCore, KeysDevtoolsCoreNoOp] = constructCoreClass(Component)

export { KeysDevtoolsCore, KeysDevtoolsCoreNoOp }
