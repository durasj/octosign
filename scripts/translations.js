/**
 * Tools for translation extraction and building
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve, basename, join } = require('path');
const { readdir, readFile, writeFile, stat, exists } = require('fs-extra');
const Scanner = require('i18next-scanner');
const { i18nextToPo, gettextToI18next } = require('i18next-conv');

// From Florian Klampfer
async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

if (process.argv[2] === 'extract') {
  (async () => {
    const parser = new Scanner.Parser({
      nsSeparator: false,
      keySeparator: false,
    });

    for await (const file of getFiles('./src')) {
      // Skip jest and unit test files and files that don't end with 'ts, .tsx or .js'
      if (/.*jest.*|.*test\.(js|ts|tsx)|.*\.d.ts/.test(file) || !/.*(js|ts|tsx)/.test(file))
        continue;

      parser.parseFuncFromString(await readFile(file, 'utf-8'), { list: ['t'] });
    }

    const extracted = parser.get().en.translation;

    // Add translations from backends
    const backends = await readdir('./backends/');
    await Promise.all(
      backends.map(async backend => {
        const backendDir = resolve('./backends/', backend);
        if (backend === 'dist' || !(await stat(backendDir)).isDirectory()) return;
        const translationsFile = join(backendDir, 'translations.po');
        if (!(await exists(translationsFile))) return;

        const fromBackend = await gettextToI18next('en', await readFile(translationsFile));
        Object.keys(JSON.parse(fromBackend)).forEach(key => (extracted[key] = ''));
      }),
    );

    const buffer = await i18nextToPo('en', JSON.stringify(extracted));

    await writeFile('./translations/en-US.po', buffer);
  })();
}

if (process.argv[2] === 'build') {
  (async () => {
    for await (const file of getFiles('./translations')) {
      // Skip template
      if (file.endsWith('en-US.po')) continue;

      const code = basename(file, '.po');

      const converted = await gettextToI18next(code, await readFile(file, 'utf-8'));

      await writeFile(`./src/translations/${code}.json`, converted);
    }
  })();
}
