import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build:client',
  outputDirectory: 'dist',
};

export default config;
