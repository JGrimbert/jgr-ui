import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { RequestHandler } from './$types';

const PLACEHOLDER = `<!doctype html>
<html>
<head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0c0c16;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    color: #2a2a3a;
    font-style: italic;
  }
</style></head>
<body>roadmap non générée</body>
</html>`;

export const GET: RequestHandler = () => {
  const htmlPath = join(process.cwd(), 'ai/roadmap.html');
  const html = existsSync(htmlPath) ? readFileSync(htmlPath, 'utf-8') : PLACEHOLDER;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
};
