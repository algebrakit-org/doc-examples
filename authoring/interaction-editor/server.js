const express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = Number(process.env.PORT || 3015);

const API_KEY = '...'; //The API key that you received from AlgebraKiT or created in the management console
const TARGET = 'https://api.algebrakit.com';

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
app.use(express.static('.', {
    index: 'interaction-editor.html'
}));

app.listen(port, function() {
  console.log(`Listening at ${port}`);
});
