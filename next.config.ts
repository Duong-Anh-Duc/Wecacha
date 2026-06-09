import createNextIntlPlugin from "next-intl/plugin";
import type {NextConfig} from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{type: "host", value: "coffe-fawn-beta.vercel.app"}],
        destination: "https://sonlaspecialtycoffee.vn/:path*",
        permanent: true
      }
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [75, 80, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      },
      {
        protocol: "https",
        hostname: "images.vietnam.travel"
      },
      {
        protocol: "https",
        hostname: "randomuser.me"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"]
  }
};

export default withNextIntl(nextConfig);
