import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Google Search (and browsers) look for /favicon.ico at the root.
        // Redirect to the stable public/ PNG so the URL never changes between builds.
        source: "/favicon.ico",
        destination: "/logo-icon.png",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
