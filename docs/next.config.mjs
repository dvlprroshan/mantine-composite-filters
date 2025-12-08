import createMDX from '@next/mdx';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import signale from 'signale';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkSlug],
  },
});

let repository;

try {
  const packageJson = fs.readJsonSync('../package/package.json');
  repository = packageJson.repository.split('/').at(-1).replace('.git', '');
} catch {
  signale.error('Failed to read repository field of package/package.json\n');
  process.exit(1);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? `/${repository}` : undefined,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['mantine-composite-filters'],
  webpack: (config, { isServer }) => {
    // Resolve workspace package to source directory
    const packagePath = path.resolve(__dirname, '../package');
    const distPath = path.join(packagePath, 'dist');
    
    config.resolve.alias = {
      ...config.resolve.alias,
      'mantine-composite-filters': path.join(packagePath, 'src'),
      'mantine-composite-filters/styles.css': path.join(distPath, 'styles.css'),
    };

    // Add package to module resolution
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.join(packagePath, 'node_modules'),
    ];

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Add raw-loader for demo code imports
    config.module.rules.push({
      test: /\.tsx?$/,
      resourceQuery: /raw/,
      type: 'asset/source',
    });

    return config;
  },
};

export default withMDX(nextConfig);
