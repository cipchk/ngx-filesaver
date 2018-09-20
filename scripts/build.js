const path = require('path');
const ngPackage = require('ng-packagr');
const fs = require('fs');

const root = path.resolve(__dirname, `..`);

ngPackage
  .ngPackagr()
  .forProject(path.resolve(root, `./package.json`))
  .withTsConfig(path.resolve(root, './lib/tsconfig.lib.json'))
  .build()
  .then(() => fs.copyFileSync('README.zh-CN.md', 'publish/README.zh-CN.md'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
