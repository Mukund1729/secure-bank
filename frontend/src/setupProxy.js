const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // backend `application.yml` exposes server on port 8080 with context-path `/api`
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '/api'
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        if (!res.headersSent) {
          res.writeHead(500, {
            'Content-Type': 'application/json'
          });
        }
        res.end(JSON.stringify({ 
          error: 'Proxy error', 
          message: err.message 
        }));
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request to:', req.originalUrl);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Received response with status:', proxyRes.statusCode);
      }
    })
  );
};
