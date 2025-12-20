import http from 'http';
import sirv from 'sirv';

const PORT = process.env.PORT || 3000;

const args = process.argv.slice(2);
const isDev = !args.includes('--prod') && process.env.NODE_ENV !== 'production';

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
    const url = `http://localhost:${PORT}`;
    // ANSI escape code for clickable link (OSC 8)
    const link = `\u001b]8;;${url}\u0007${url}\u001b]8;;\u0007`;
    console.log(`\n🎮 jsPacman Server running at ${link} (${mode})\n`);
});
