# rollup-plugin-replace-worker-import-meta-url

Rollup plugin to update `import.meta.url` and relative dynamic urls to use `import.meta.resolve` instead.

For example, this plugin will transform the following code:

```js
const worker = new Worker(new URL("./my-worker.js", import.meta.url));
worker.postMessage({ foo: "bar" });
```

Into:

```js
const worker = new Worker(import.meta.resolve("./my-worker.js"));
worker.postMessage({ foo: "bar" });
```

## Why?

This plugin is solving a niche problem with Vite. Vite seems to have some issues with using a worker inside a worker ([Vite#13367](https://github.com/vitejs/vite/issues/13367)). Once this issue is resolved, this plugin will no longer be needed.

Using `import.meta.resolve` instead of `import.meta.url` seems to be a hacky workaround for this issue.

## Installation

```bash
npm install --save-dev rollup-plugin-replace-worker-import-meta-url
```

## Usage

```js
// rollup.config.js
import replaceWorkerImportMetaUrl from "rollup-plugin-replace-worker-import-meta-url";

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [replaceWorkerImportMetaUrl()],
};
```

## Options

### `include` (optional)

**Type**: `Array[RegExp | String]`<br>

When include is configured only matching files will be transformed by the plugin.

### `exclude` (optional)

**Type:** `Array[RegExp | String]`<br>

When exclude is configured any matching files will not be transformed by the plugin.
