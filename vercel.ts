import { routes, type VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build:client',
  outputDirectory: 'dist',
  functions: {
    'api/index.ts': {
      includeFiles: 'server/**',
    },
  },
  rewrites: [
    routes.rewrite('/api/(.*)', '/api'),
  ],
};

export default config;
