import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

// Configurar CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Route handler for root
app.get('/', (req, res) => {
    res.send('API Gateway is running');
});

// En lugar de app.use('/auth'), usamos pathFilter para no cortar el prefijo de la URL
app.use(createProxyMiddleware({
    pathFilter: '/auth',
    target: 'http://localhost:3004',
    changeOrigin: true,
}));

// Proxy explícito para Products Service BFF
app.use(createProxyMiddleware({
    pathFilter: '/products',
    target: 'http://localhost:3000',
    changeOrigin: true,
}));

// Proxy explícito para Company Service BFF
app.use(createProxyMiddleware({
    pathFilter: '/company',
    target: 'http://localhost:3000',
    changeOrigin: true,
}));

// Proxy genérico API (si se usara en el futuro)
app.use(createProxyMiddleware({
    pathFilter: '/api',
    target: 'http://localhost:3000',
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
}));

app.listen(PORT, () => {
    console.log(`API Gateway escuchando en http://localhost:${PORT}`);
});
