import * as Path from 'path';
import * as Fs from 'fs';
import * as Url from 'url';

declare var module: any;


// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = Fs.realpathSync(process.cwd());
const resolveApp = relativePath => Path.resolve(appDirectory, relativePath);

(module).exports = {
    appResources: resolveApp('src/resources'),
};
  