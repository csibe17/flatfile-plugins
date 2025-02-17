import type { Flatfile } from '@flatfile/api'
import type { FlatfileEvent } from '@flatfile/listener'
import { configureSpace } from '@flatfile/plugin-space-configure'
import type { ModelToSheetConfig, PartialWorkbookConfig } from './setup.factory'
import { generateSetup } from './setup.factory'

export function configureSpaceWithYamlSchema(
  models?: ModelToSheetConfig[],
  options?: {
    workbookConfig?: PartialWorkbookConfig
    debug?: boolean
  },
  callback?: (
    event: FlatfileEvent,
    workbookIds: string[],
    tick: (progress: number, message?: string) => Promise<Flatfile.JobResponse>
  ) => any | Promise<any>
) {
  return configureSpace(() => generateSetup(models, options), callback)
}

export * from './setup.factory'
