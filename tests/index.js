import { test } from "uvu";
import * as assert from "uvu/assert";
import ImportMetaResolvePlugin from "../index.js";

const ReplaceTestMatrix = [
  [
    `new Worker(new URL('./foo.js', import.meta.url));`,
    `new Worker(import.meta.resolve('./foo.js'));`,
  ],
  [
    `new Worker(new URL("./foo.js", import.meta.url));`,
    `new Worker(import.meta.resolve("./foo.js"));`,
  ],
  [
    `new Worker(new URL(  './foo.js', import.meta.url));`,
    `new Worker(import.meta.resolve('./foo.js'));`,
  ],
  [
    `new Worker(new URL("  ./foo.js  ", import.meta.url   ));`,
    `new Worker(import.meta.resolve("  ./foo.js  "));`,
  ],
  [
    `new Worker(new URL('./foo.js', import.meta.url), {
        type: 'module'
    });`,
    `new Worker(import.meta.resolve('./foo.js'), {
        type: 'module'
    });`,
  ],
  [
    `
    new Worker(new URL('./foo.js', import.meta.url));
    new Worker(new URL('./bar.js', import.meta.url));
    new Worker(new URL('./fizz.js', import.meta.url));
    `,
    `
    new Worker(import.meta.resolve('./foo.js'));
    new Worker(import.meta.resolve('./bar.js'));
    new Worker(import.meta.resolve('./fizz.js'));
    `,
  ],
];

const SkipTestMatrix = [
  [`new Worker(new URL('./foo.js', 'non-import-meta-url'));`, null],
  [`new Worker(new URL('./foo.js'));`, null],
  [`new Worker(import.meta.resolve('./foo.js'));`, null],
  [`new Worker('./foo.js');`, null],
];

ReplaceTestMatrix.forEach(([input, expected]) => {
  test(`replaces "${input}" with "${expected}"`, () => {
    const plugin = ImportMetaResolvePlugin();
    const result = plugin.transform(input, "file.js");
    assert.is(result?.code, expected);
  });
});

SkipTestMatrix.forEach(([input, expected]) => {
  test(`Does not affect the input "${input}"`, () => {
    const plugin = ImportMetaResolvePlugin();
    const result = plugin.transform(input, "file.js");
    assert.is(result, expected);
  });
});

test(`can include only specified modules`, () => {
  const plugin = ImportMetaResolvePlugin({
    include: [/the-module/],
  });
  const result1 = plugin.transform(
    `new Worker(new URL('./foo.js', import.meta.url));`,
    "other-module/file.js",
  );
  assert.is(result1, null);
  const result2 = plugin.transform(
    `new Worker(new URL('./foo.js', import.meta.url));`,
    "the-module/file.js",
  );
  assert.is(result2?.code, `new Worker(import.meta.resolve('./foo.js'));`);
});

test(`can exclude specified modules`, () => {
  const plugin = ImportMetaResolvePlugin({
    exclude: [/ignore-module/],
  });
  const result1 = plugin.transform(
    `new Worker(new URL('./foo.js', import.meta.url));`,
    "ignore-module/file.js",
  );
  assert.is(result1, null);
  const result2 = plugin.transform(
    `new Worker(new URL('./foo.js', import.meta.url));`,
    "transform-this-module/file.js",
  );
  assert.is(result2?.code, `new Worker(import.meta.resolve('./foo.js'));`);
});

test.run();
