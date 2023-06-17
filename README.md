
    run `npm install`
    run `ng serve --proxy-config proxy.conf.json` // 



You can use the proxying support in the webpack dev server to divert certain URLs to a backend server, by passing a file to the --proxy-config build option. For example, to divert all calls for http://localhost:4200/api to a server running on http://localhost:3000/api, take the following steps.

1-Create a file proxy.conf.json in your project's src/ folder.

2-Add the following content to the new proxy file:
{
  "/api": {
    "target": "http://localhost:3007",
    "secure": false
  }
}

3-In the CLI configuration file, angular.json, add the proxyConfig option to the serve target:


...
"architect": {
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "src/proxy.conf.json"
    },
...

4-to run the dev server with this proxy configuration, call ng serve.
 
-Angular  defaut port is 4200  to chnage :run ng serve --proxy-config proxy.conf.json  --port 4207 --open


to chnage port socket.io : go to FrontEnd\Iot-Factory\src\app\pages\dashboard\dash.service.ts   chnage to 3007

to change port proxy go to :  proxy.conf.json