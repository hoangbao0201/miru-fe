// import withBundleAnalyzer from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/anime",
                destination: "/anime/t",
                permanent: true,
            },
            {
                source: "/truyen/:path*",
                destination: "/comics/truyen/:path*",
                permanent: true,
            },
            {
                source: "/user/:path*",
                destination: "/comics/user/:path*",
                permanent: true,
            },
            {
                source: "/tim-truyen/:path*",
                destination: "/comics/tim-truyen/:path*",
                permanent: true,
            },
            {
                source: "/tags/:path*",
                destination: "/comics/tags/:path*",
                permanent: true,
            },
            {
                source: "/seo/:path*",
                destination: "/comics/seo/:path*",
                permanent: true,
            },
            {
                source: "/nen/:path*",
                destination: "/comics/nen/:path*",
                permanent: true,
            },
            {
                source: "/donate/:path*",
                destination: "/comics/donate/:path*",
                permanent: true,
            },
            {
                source: "/chinh-sach-bao-mat/:path*",
                destination: "/comics/chinh-sach-bao-mat/:path*",
                permanent: true,
            },
            {
                source: "/canh-gioi/:path*",
                destination: "/comics/canh-gioi/:path*",
                permanent: true,
            },
            {
                source: "/artworks/:path*",
                destination: "/comics/artworks/:path*",
                permanent: true,
            },
            {
                source: "/hot/:path*",
                destination: "/comics/hot/:path*",
                permanent: true,
            },
            {
                source: "/theo-doi/:path*",
                destination: "/comics/theo-doi/:path*",
                permanent: true,
            },
            {
                source: "/top-theo-doi/:path*",
                destination: "/comics/top-theo-doi/:path*",
                permanent: true,
            },
            {
                source: "/secure/:path*",
                destination: "/comics/secure/:path*",
                permanent: true,
            },
            {
                source: "/bai-viet/:path*",
                destination: "/comics/bai-viet/:path*",
                permanent: true,
            },
            {
                source: "/creator/:path*",
                destination: "/comics/creator/:path*",
                permanent: true,
            },
        ];
    },
    staticPageGenerationTimeout: 1000,
    compiler: {
        styledComponents: true,
    },
    images: {
        unoptimized: false,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "drive.google.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "upload.wikimedia.org",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "phinf.pstatic.net",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.cluodlfare.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "./miru-fe/src.cloudkkvippro.online",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "./miru-fe/src.cloudkkvippro.online",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "1.bp.blogspot.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "2.bp.blogspot.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "3.bp.blogspot.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "4.bp.blogspot.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "1.bp.blogspot.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "2.bp.blogspot.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "3.bp.blogspot.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "4.bp.blogspot.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    webpack(config) {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
        };
        return config;
    },
};

// export default withBundleAnalyzer({
//     enabled: process.env.ANALYZE === 'true',
// })(nextConfig);

export default nextConfig;

// $env:ANALYZE="true"; yarn build
