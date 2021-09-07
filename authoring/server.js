const express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = Number(process.env.PORT || 3015);

const API_KEY = '...'; //The API key that you received from AlgebraKiT or created in the management console

const TARGET = 'https://algebrakit.eu';

//This proxy adds the api key header to access the secure AlgebraKiT API
var proxySecure = createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: {
        '^/algebrakit-secure' : '/'  // remove base path 
    },
    onProxyReq: function (proxyReq, req, res) {
        proxyReq.setHeader('x-api-key', API_KEY);
    }
});

app.use('/algebrakit-secure', proxySecure);

app.use('/*', function(req, res) {
    res.status(200).sendFile('/exercise-editor.html', {root: __dirname});
})

app.listen(port, function() {
  console.log(`Listening at ${port}`);
});
