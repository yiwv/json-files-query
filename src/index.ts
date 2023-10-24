import destr from "destr";
import { createStorage } from "unstorage";
import type { Storage, StorageValue } from "unstorage"
import fsDriver from "unstorage/drivers/fs";
import { createPipelineFetcher } from './modules/match/pipeline.js';
import { createQuery } from './modules/query.js';

export default function jsonFilesQuery(contentPath: string) {
  const storage: Storage = createStorage({ driver: fsDriver({ base: contentPath }) });
  return initializeQueryContent(storage);
}

function isJsonFile(key: string): boolean {
  return key.endsWith('.json');
}

async function getContentIds(storage: Storage) {
  const keys = await storage.getKeys();
  return keys.filter(isJsonFile);
}

async function fetchContent(storage: Storage, id: string) {
  const content: StorageValue = await storage.getItem(id);
  return content === null ? { _id: id, body: null } : parseContent(id, content);
}

async function parseContent(id: string, content: StorageValue) {
  if (typeof content !== "string" || !id.endsWith("json")) {
    return content;
  }

  const parsed = destr(content);
  if (Array.isArray(parsed)) {
    console.warn(`JSON array is not supported in ${id}, moving the array into the \`body\` key`);
    return { body: parsed };
  }

  const parsedObject = parsed as Record<string, unknown>;

  return { ...parsedObject, _id: id, _type: "json" };
}

async function getAllContents(storage: Storage) {
  const ids = await getContentIds(storage);
  return Promise.all(ids.map(id => fetchContent(storage, id)));
}

function initializeQueryContent(storage: Storage) {
  const queryBuilder = createQuery(
    query => createPipelineFetcher(() => getAllContents(storage))(query),
    { initialParams: {}, legacy: true }
  );
  const originalParamsFn = queryBuilder.params;

  queryBuilder.params = () => {
    const params = originalParamsFn();
    if (!params.sort?.length) {
      params.sort = [{ _file: 1, $numeric: true }];
    }
    return params;
  };

  return queryBuilder;
}
