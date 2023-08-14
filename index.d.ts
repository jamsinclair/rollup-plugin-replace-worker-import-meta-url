/**
 * @param {object} [options]
 * @param {(string | RegExp)[]} [options.include]
 * @param {(string | RegExp)[]} [options.exclude]
 */
export default function ReplaceWorkerImportMetaUrl({
  include,
  exclude,
}?: {
  include?: (string | RegExp)[];
  exclude?: (string | RegExp)[];
}): {
  name: string;
  transform(
    code: any,
    id: any,
  ): {
    code: string;
    map: import("magic-string").SourceMap;
  };
};
