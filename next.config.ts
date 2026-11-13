import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "cdn.jsdelivr.net" },
			{ protocol: "https", hostname: "www.kali.org" },
			{ protocol: "https", hostname: "dashboardicons.com" },
			{ protocol: "https", hostname: "github.com" },
			{ protocol: "https", hostname: "raw.githubusercontent.com" },
			{ protocol: "https", hostname: "avatars.githubusercontent.com" },
			{ protocol: "https", hostname: "exiftool.org" },
		],
	},
};

export default nextConfig;
