import type { NextConfig } from 'next';
const config: NextConfig = { devIndicators: false, turbopack: { root: process.cwd() }, allowedDevOrigins: ['terminal.local'], poweredByHeader: false };
export default config;
