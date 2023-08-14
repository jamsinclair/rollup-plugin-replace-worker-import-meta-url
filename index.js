import { createFilter } from "@rollup/pluginutils";
import MagicString from "magic-string";

const NewWorkerWithImportMetaRegEx =
  /new\s+Worker\(\s*new\s+URL\(\s*(['"]\s*[^'"]+\s*['"])\s*,\s*import\.meta\.url\s*\)/g;

/**
 * @param {object} [options]
 * @param {(string | RegExp)[]} [options.include]
 * @param {(string | RegExp)[]} [options.exclude]
 */
export default function ReplaceWorkerImportMetaUrl({ include, exclude } = {}) {
  const filter = createFilter(include, exclude);
  return {
    name: "replace-worker-import-meta-url",
    transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      if (!NewWorkerWithImportMetaRegEx.test(code)) {
        return null;
      }

      NewWorkerWithImportMetaRegEx.lastIndex = 0;
      const newSource = new MagicString(code);

      const matches = code.matchAll(NewWorkerWithImportMetaRegEx);
      for (const match of matches) {
        const [fullMatch, url] = match;
        newSource.overwrite(
          match.index,
          match.index + fullMatch.length,
          `new Worker(import.meta.resolve(${url})`,
        );
      }

      return {
        code: newSource.toString(),
        map: newSource.generateMap({ source: id }),
      };
    },
  };
}
