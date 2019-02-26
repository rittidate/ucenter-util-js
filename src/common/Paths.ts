import * as path from 'path';
import * as fs from 'fs';

declare var module: any;


// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

(module).exports = {
    appResources: resolveApp('src/resources'),
};
  