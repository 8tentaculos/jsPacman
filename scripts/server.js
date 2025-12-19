import http from 'http';
import sirv from 'sirv';

const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

const notFound = (req, res) => {
    res.statusCode = 404;
    res.end('Not found');
};

let handler;

if (isDev) {
    const servePublic = sirv('public', { dev: true });
    const serveSrc = sirv('src', { dev: true });
    handler = (req, res) => servePublic(req, res, () => serveSrc(req, res, () => notFound(req, res)));
} else {
    const serveDist = sirv('dist', { dev: false });
    handler = (req, res) => serveDist(req, res, () => notFound(req, res));
}

const server = http.createServer(handler);

server.listen(PORT, () => {
    const mode = isDev ? 'development' : 'production';
    console.log(`\n🎮 jsPacman Server ${isDev ? '👻' : '🟡'} running at http://localhost:${PORT} (${mode})\n`);
});

