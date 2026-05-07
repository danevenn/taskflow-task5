import type { IncomingMessage, ServerResponse } from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';

function listDir(dir: string, depth = 2): string[] {
  if (depth < 0) return [];
  try {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return [`${full}/`, ...listDir(full, depth - 1)];
      }
      return [full];
    });
  } catch (err) {
    return [`<err reading ${dir}: ${(err as Error).message}>`];
  }
}

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
  for (let i = 0; i < 20 && !app && !bootError; i++) {
    await new Promise((r) => setTimeout(r, 50));
  }
  if (bootError) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        bootError,
        cwd: process.cwd(),
        node: process.version,
        listingTask: listDir('/var/task'),
        listingApi: listDir('/var/task/api', 3),
        listingServer: listDir('/var/task/server', 4),
      }),
    );
    return;
  }
  if (!app) {
    res.statusCode = 503;
    res.end('still loading');
    return;
  }
  app(req, res);
}
