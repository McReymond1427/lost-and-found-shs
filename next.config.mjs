/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // This 'masks' Supabase as part of your own domain
        source: '/_supabase/:path*',
        destination: 'https://mugzzeulgpvqraatyyww.supabase.co/:path*',
      },
    ];
  },
};

export default nextConfig;