import { buildApp } from './app.js';
import { env } from './config/env.js';

const app = buildApp();

app.listen(env.port, () => {
  console.log(`[server] listening on http://localhost:${env.port}`);
  console.log(`[server] env=${env.nodeEnv}`);
});
