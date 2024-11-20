import { Extractor } from '@flatfile/util-extractor'
import { parseBuffer } from './parser'

export interface PluginOptions {
  chunkSize?: number
  parallel?: number
  debug?: boolean
}

export const JSONLExtractor = (options?: PluginOptions) => Extractor(
  /\.(jsonl|jsonlines)$/i,
  'jsonl',
  parseBuffer,
  options
);

export const jsonlParser = parseBuffer
