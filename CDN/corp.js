const webpack = require('webpack');
const fs = require('fs');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.dev');

const args = process.argv.slice(2);
let https = false;
if (args.includes('--https')) https = true;

function runFunc(err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at http://127.0.0.1:3300/index.html');
}

new WebpackDevServer(
  {
    port: 3300,
    host: '0.0.0.0',
    open: https ? 'https://localhost:3300/' : 'http://127.0.0.1:3300/',
    server: {
      type: https ? 'https' : 'http',
      options: {
        cert: fs.readFileSync('./localhost.crt'),
          key: fs.readFileSync('./localhost.key')
      },
    },
    headers: {
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    historyApiFallback: true,
    proxy: [
      {
        path: '/meeting.html',
        target: 'http://127.0.0.1:9998/'
      }
    ],
    static: './',
    allowedHosts: 'all'
  },
  webpack(webpackConfig)
).start(3300, '0.0.0.0', runFunc);

new WebpackDevServer(
  {
    port: 9998,
    host: '0.0.0.0',
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    historyApiFallback: true,
    static: './'
  },
  webpack(webpackConfig)
).start(9998, '0.0.0.0', runFunc);
