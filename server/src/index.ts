import { buildApp } from './app';
import { env } from './config/env';

const app = buildApp();

app.listen(env.port, () => {
  console.log(`[server] listening on http://localhost:${env.port}`);
  console.log(`[server] env=${env.nodeEnv}`);
});
