import api, { Flatfile } from "@flatfile/api"
import type { FlatfileEvent, FlatfileListener } from '@flatfile/listener'

export type Primitive = string | number | null | boolean
export type SimpleRecord = Record<string, Primitive>

export function copyColumn() {
    return (listener: FlatfileListener) => {
      listener.on('workbook:created', async ({ context: { fileId, workbookId } }: FlatfileEvent) => {
        const { data: sheets } = await api.sheets.list({ workbookId })

        sheets.forEach(async (sheet) => {
          const loadAllFields = await getAllFields(sheets, sheet.slug);
          setSheetActions(sheet, [
              copyColumnValuesBlueprint(loadAllFields),
              ...(sheet.config.actions?.filter(
              (a) =>
                  a.operation !== 'copy-column'
              ) || []),
          ]);
        })
      })

      listener.on("job:ready", { job: "sheet:copy-column" }, async (e) => {
        const { records } = await e.data({ pageLength: 10_000 })
        const { data: job } = await api.jobs.get(e.context.jobId)
        const { key_copy_from, key_paste_to } = job.input
        const patch = records.map(copyColumnValues(key_copy_from, key_paste_to))

        await updateRecords(e.context.sheetId, patch)

        await api.jobs.complete(e.context.jobId, {
          outcome: {
            message: `Data was successfully copied from ${key_copy_from} to ${key_paste_to}.`,
          },
        });
      })
    }
}

function copyColumnValues(from_key: string, to_key: string) {
  return (record: Flatfile.Record_) => {
    const obj = toSimpleRecord(record)
    return {
      id: record.id,
      values: {
        [to_key]: { value: obj[from_key] },
      },
    }
  }
}

/**
 * Updates records in a sheet. Bypasses API SDK in order to suppress hooks
 */
 async function updateRecords(sheetId: string, records: any): Promise<string> {
    const httpResponse = await fetch(
      `${process.env.FLATFILE_API_URL || process.env.AGENT_INTERNAL_URL}/v1/sheets/${sheetId}/records`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.FLATFILE_BEARER_TOKEN}`,
          "Content-Type": "application/json",
          "x-force-hooks": "true",
        },
        body: JSON.stringify(records),
      }
    )
  
    if (httpResponse.status === 304) {
      return "not-modified"
    }
    if (!httpResponse.ok) {
      console.log(await httpResponse?.text())
      throw new Error(`Updating records failed.`)
    }
  
    const res = await httpResponse.json()
    return res.data.commitId
}

function toSimpleRecord(r: Flatfile.Record_): SimpleRecord {
    const obj = Object.fromEntries(Object.entries(r.values).map(([key, value]) => [key, value.value] as [string, any]))
    obj.id = r.id
    return obj as SimpleRecord
}

/**
 * Set sheet actions
 *
 * @param sheet
 * @param actions
 */
 async function setSheetActions(sheet: any, actions: Flatfile.Action[]) {
    try {
      const { constraints } = sheet.config;
      await api.workbooks.update(sheet.workbookId, {
        sheets: [
          {
            name: sheet.name,
            slug: sheet.config.slug,
            actions,
          },
        ],
      });
  
      if (constraints?.length > 0) {
        await api.workbooks.update(sheet.workbookId, {
          sheets: [
            {
              ...sheet,
              config: {
                ...sheet.config,
                actions,
                constraints,
              },
            },
          ],
        });
      }
    } catch (e) {
      console.log({ e });
    }
  }

  export const getAllFields = (sheets, sheetSlug) => {
    const _fields = sheets.reduce((acc, sheet) => {
      console.log("in getallfields, sheet.config.fields here: ")
      console.log(sheet.config)
      if (sheet.config.slug == sheetSlug) {
        acc.push(
          ...sheet.config.fields
            .map((f) => {
              return { ...f, appearance: { size: "s" } } as const
            })
        )
      }
      return acc
    }, [] as Flatfile.Property[])
  
    return _fields
  }

export const copyColumnValuesBlueprint = (columns: Flatfile.Property[]): Flatfile.Action => ({
  label: "Copy Column",
  primary: false,
  operation: "copy-column",
  inputForm: {
    type: "simple",
    fields: [
      {
        key: "key_copy_from",
        type: "enum",
        label: "Copy data from column",
        config: {
          options: columns
            .map((f) => ({ label: f.label, value: f.key }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        },
        constraints: [{ type: "required" }],
      },
      {
        key: "key_paste_to",
        type: "enum",
        label: "Paste data to column",
        config: {
          options: columns
            .map((f) => ({ label: f.label, value: f.key }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        },
        constraints: [{ type: "required" }],
      },
    ],
  },
})