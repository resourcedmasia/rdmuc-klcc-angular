// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  appVersion: require('../../package.json').version + '-dev',
  apiUrl: 'http://10.1.128.47:8080/api/api.php',
  production: false
};
