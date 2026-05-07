import type { IncomingMessage, ServerResponse } from 'node:http';

let app: ((req: IncomingMessage, res: ServerResponse) => void) | null = null;
let bootError: { message: string; stack?: string } | null = null;

(async () => {
  try {
    const mod = await import('../server/src/app');
    app = mod.buildApp();
  } catch (err) {
    bootError = {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    };
  }
})();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  // wait briefly for top-level await import to resolve
  for (let i = 0; i < 20 && !app && !bootError; i++) {
    await new Promise((r) => setTimeout(r, 50));
  }
  if (bootError) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ bootError, node: process.version }));
    return;
  }
  if (!app) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'app still loading' }));
    return;
  }
  app(req, res);
}
