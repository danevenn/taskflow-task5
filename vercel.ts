import { routes, type VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build:client',
  outputDirectory: 'dist',
  rewrites: [
    routes.rewrite('/((?!api/).*)', '/index.html'),
  ],
};

export default config;
