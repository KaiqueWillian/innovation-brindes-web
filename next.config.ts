import type { NextConfig } from 'next';

function resolveImageHostname(rawHost?: string) {
  if (!rawHost) {
    return null;
  }

  if (rawHost.includes('://')) {
    try {
      return new URL(rawHost).hostname;
    } catch {
      return null;
    }
  }

  return rawHost;
}

const imageHostname = resolveImageHostname(process.env.NEXT_PUBLIC_IMAGE_HOST);
const defaultApiBaseUrl = 'https://apihomolog.innovationbrindes.com.br';
const configuredApiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? '').trim();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: configuredApiBaseUrl || defaultApiBaseUrl
  },
  images: {
    remotePatterns: [
      ...(imageHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: imageHostname
            },
            {
              protocol: 'http' as const,
              hostname: imageHostname
            }
          ]
        : [
            {
              protocol: 'https' as const,
              hostname: 'images.unsplash.com'
            }
          ]),
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'imgprodutos.s3.us-east-2.amazonaws.com'
      },
      {
        protocol: 'http',
        hostname: 'imgprodutos.s3.us-east-2.amazonaws.com'
      }
    ]
  }
};

export default nextConfig;
