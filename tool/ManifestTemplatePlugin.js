const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = require('glob');

const asyncWriteFile = promisify(fs.writeFile);
const asyncReadFile = promisify(fs.readFile);
const asyncGlob = promisify(glob);

module.exports = class ManifestTemplatePlugin {
  constructor(opt = {}) {
    this.manifest = opt.manifest;
    this.output = opt.output;
    this.backgroundScripts = opt.backgroundScripts;
    this.contentScripts = opt.contentScripts;
  }

  apply(compiler) {
    compiler.hooks.done.tapPromise('ManifestTemplatePlugin', async stats => {
      const raw = await asyncReadFile(this.manifest, { encoding: 'utf8' });
      const manifest = JSON.parse(raw);

      const output = this.output || compiler.outputPath;

      // get background scripts
      const backgroundScripts = await this.getGlobFiles(
        this.backgroundScripts,
        output
      );
      const contentScripts = await this.getGlobFiles(
        this.contentScripts,
        output
      );

      if (Array.isArray(backgroundScripts) && backgroundScripts.length > 0) {
        manifest.background = manifest.background || {};
        manifest.background.scripts = (
          manifest.background.scripts || []
        ).concat(backgroundScripts);
      }

      if (Array.isArray(contentScripts) && contentScripts.length > 0) {
        manifest.content_scripts = manifest.content_scripts || [];
        manifest.content_scripts.push({
          matches: ['*://*.github.com/*'],
          js: contentScripts
        });
      }

      await asyncWriteFile(
        path.join(output, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
    });
  }

  async getGlobFiles(glob, output) {
    const files = await asyncGlob(glob);
    return files.map(file => path.relative(output, file));
  }
};
