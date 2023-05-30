import { FlatfileListener, FlatfileEvent } from '@flatfile/listener'
import { RecordHook } from './RecordHook'
import type { FlatfileRecord } from '@flatfile/hooks'
export * from './RecordHook'
export const recordHook = (
  sheetSlug: string,
  callback: (record: FlatfileRecord) => {}
) => {
  return (client: FlatfileListener) => {
    client.on(
      'commit:created',
      {
        // todo: fix this filter
        context: {
          // @ts-ignore
          sheetSlug,
        },
      },
      (event: FlatfileEvent) => {
        return RecordHook(event, callback)
      }
    )
  }
}
