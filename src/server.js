import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express()
app.use(cors())

// https://www.npmjs.com/package/http-proxy-middleware
app.use('/api', createProxyMiddleware({ target: 'https://api.um.warszawa.pl', changeOrigin: true }));



app.listen(8088, () => {
    console.info('proxy server is running on port 8088')
})