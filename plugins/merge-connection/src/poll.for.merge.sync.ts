import { Flatfile } from '@flatfile/api'
import { MergeClient } from '@mergeapi/merge-node-client'
import { MAX_SYNC_ATTEMPTS, SYNC_RETRY_INTERVAL_MS } from './config'
import { checkAllSyncsComplete } from './sync.status.check'
import { handleError } from './utils'

export async function waitForMergeSync(
  mergeClient: MergeClient,
  category: string,
  tick: (progress: number, message?: string) => Promise<Flatfile.JobResponse>
): Promise<void> {
  try {
    let attempts = 0
    let syncStatusComplete = false

    while (attempts <= MAX_SYNC_ATTEMPTS && !syncStatusComplete) {
      const result = await checkAllSyncsComplete(mergeClient, category)
      if (!result) {
        attempts++
        continue
      }
      const { allComplete, completedSyncs, totalModels, syncedModels } = result

      if (!syncStatusComplete) {
        syncStatusComplete = allComplete

        await tick(
          Math.min(40, Math.round(10 + (30 * completedSyncs) / totalModels)),
          'Merge syncing with Integration...'
        )
      }

      if (!syncStatusComplete) {
        attempts++
        console.log('Waiting for Merge to sync...')
        await new Promise((resolve) =>
          setTimeout(resolve, SYNC_RETRY_INTERVAL_MS)
        )
      }
    }

    if (!syncStatusComplete) {
      throw new Error('Merge sync timed out')
    }
  } catch (e) {
    handleError(e, 'Error waiting for Merge sync')
  }
}
