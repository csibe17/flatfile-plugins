import { jsonParser } from '@flatfile/plugin-json-extractor'

export const parseBuffer = (buffer: Buffer) => {
    const fileContents = buffer.toString('utf8')
    const jsonlFromJson = `[${fileContents.replace(/\n/g, ",").trim().replace(/,$/, "")}]`;
    const newBuffer = Buffer.from(jsonlFromJson)
    return jsonParser(newBuffer);
};
