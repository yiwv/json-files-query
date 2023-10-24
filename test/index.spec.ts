import { describe, it, expect, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import jsonFilesQuery from '../src/index';

function getDirName(importMetaUrl) {
  return path.dirname(fileURLToPath(importMetaUrl));
}

describe('jsonFilesQuery', () => {
  const __dirname = getDirName(import.meta.url);
  const targetPath = path.resolve(__dirname, 'fixtures');

  afterEach(() => {
    const dynamicDataPath = path.resolve(targetPath, 'misc', 'temporary_article.json');
    if (fs.existsSync(dynamicDataPath)) {
      fs.unlinkSync(dynamicDataPath);
    }
  });

  it('queries data with specific conditions', async () => {
    const results = await jsonFilesQuery(targetPath)
      .where({ readers: { $lt: 300 } })
      .where({ $or: [{ title: { $regex: new RegExp('Deep', 'i') } }] })
      .where({ isPublished: { $ne: false } })
      .sort({ publishedDate: -1 })
      .skip(0)
      .limit(10)
      .find();

    console.log({r: results});

    expect(results.length).toBe(1);
  });

  it("filters data based on 'where' clause", async () => {
    const results = await jsonFilesQuery(targetPath)
      .where({ title: "Understanding Asynchronous JavaScript" })
      .find();

    expect(results.length).toBe(1);
    expect(results[0].title).toBe("Understanding Asynchronous JavaScript");
  });

  it("limits the number of results", async () => {
    const results = await jsonFilesQuery(targetPath).limit(2).find();
    expect(results.length).toBe(2);
  });

  it("handles dynamic data creation and deletion", async () => {
    const newArticle = { id: "temporary", title: "Temporary Article", content: "Content here", author: "Author Name", isPublished: false };
    const targetDataPath = path.resolve(targetPath, 'misc', 'temporary_article.json');
    fs.writeFileSync(targetDataPath, JSON.stringify(newArticle));

    const resultsAfterAddition = await jsonFilesQuery(targetPath).find();
    expect(resultsAfterAddition.length).toBe(6);

    fs.unlinkSync(targetDataPath);

    const resultsAfterDeletion = await jsonFilesQuery(targetPath).find();
    expect(resultsAfterDeletion.length).toBe(5);
  });

  it("handles invalid paths gracefully, returning 0 results", async () => {
    const invalidPath = path.resolve(__dirname, 'nonexistent');
    const results = await jsonFilesQuery(invalidPath).find();
    expect(results.length).toBe(0);
  });

  it("handles combined query options correctly", async () => {
    const results = await jsonFilesQuery(targetPath)
      .where({ title: "Deep Dive into JSON Query" })
      .limit(1)
      .find();
    expect(results.length).toBe(1);
    expect(results[0].title).toBe("Deep Dive into JSON Query");
  });

  it("returns 0 results for non-existent keys", async () => {
    const results = await jsonFilesQuery(targetPath)
      .where({ nonExistentKey: "nonExistentValue" })
      .find();
    expect(results.length).toBe(0);
  });
});
