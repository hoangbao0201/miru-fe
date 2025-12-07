import "./globals.scss";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import { Organization, WebSite, ComicSeries } from "schema-dts";

import { Env } from "@/config/Env";
import { JsonLd } from "@/utils/JsonLd";
import getDomainConfig from "@/lib/domain";
import ProviderLayout from "@/components/Layouts/ProviderLayout";

const inter = Inter({ subsets: ["latin"] });

const { NEXT_PUBLIC_TITLE_SEO } = Env;

export const metadata = async (): Promise<Metadata> => {
    const { appUrl } = await getDomainConfig();

    return {
        title: `${NEXT_PUBLIC_TITLE_SEO} - Đọc truyện tranh online Vietsub, Full HD`,
        description: `${NEXT_PUBLIC_TITLE_SEO} là nền tảng đọc truyện tranh online miễn phí, hỗ trợ Vietsub, full HD. Cập nhật nhanh nhất các bộ truyện mới.`,
        keywords: [
            "truyện tranh",
            "doc truyen tranh",
            "truyện tranh online",
            "truyện tranh vietsub",
            "truyen tranh full",
            "truyen tranh moi nhat",
            "truyen tranh hay",
            NEXT_PUBLIC_TITLE_SEO,
        ],
        metadataBase: new URL(appUrl),
        openGraph: {
            type: "website",
            locale: "vi_VN",
            url: appUrl,
            title: `${NEXT_PUBLIC_TITLE_SEO} - Đọc truyện tranh Vietsub mới nhất`,
            description: "Cập nhật nhanh truyện tranh hot, full HD, miễn phí.",
            siteName: NEXT_PUBLIC_TITLE_SEO,
            images: [
                {
                    url: `${appUrl}/static/images/cover.jpg`,
                    width: 1200,
                    height: 630,
                    alt: `${NEXT_PUBLIC_TITLE_SEO} - Truyện tranh Vietsub mới nhất`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${NEXT_PUBLIC_TITLE_SEO} - Đọc truyện tranh Vietsub`,
            description:
                "Cập nhật nhanh nhất các bộ truyện tranh hot, miễn phí.",
            images: [`${appUrl}/static/images/cover.jpg`],
        },
        icons: [`${appUrl}/favicon.ico`],
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { appUrl } = await getDomainConfig();

    const websiteJsonLd = JsonLd<WebSite>({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: NEXT_PUBLIC_TITLE_SEO,
        url: appUrl,
        potentialAction: {
            "@type": "SearchAction",
            target: `${appUrl}/search?q={search_term_string}`,
        },
    });

    const organizationJsonLd = JsonLd<Organization>({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: NEXT_PUBLIC_TITLE_SEO,
        url: appUrl,
        logo: `${appUrl}/static/images/logo-mirudex-x200.png`,
    });

    const comicSeriesJsonLd = JsonLd<ComicSeries>({
        "@context": "https://schema.org",
        "@type": "ComicSeries",
        name: NEXT_PUBLIC_TITLE_SEO,
        url: appUrl,
        description:
            "Trang đọc truyện tranh online, Vietsub, full HD miễn phí. Cập nhật nhanh nhất các bộ truyện mới.",
        genre: ["Truyện tranh", "Manga", "Manhwa", "Manhua"],
        publisher: {
            "@type": "Organization",
            name: NEXT_PUBLIC_TITLE_SEO,
            url: appUrl,
        },
    });

    return (
        <html lang="vi" dir="ltr" suppressHydrationWarning>
            <head>
                {/* RSS & Sitemap */}
                <link
                    rel="alternate"
                    href="/rss.xml"
                    type="application/rss+xml"
                    title={`${NEXT_PUBLIC_TITLE_SEO} - Đọc Truyện Tranh, Vietsub Mới Nhất - RSS Feed`}
                />
                <link
                    rel="sitemap"
                    type="application/xml"
                    href="/sitemap.xml"
                />

                {/* SEO Meta Tags */}
                <meta name="author" content={NEXT_PUBLIC_TITLE_SEO} />
                <meta name="robots" content="index, follow" />
                <meta name="theme-color" content="#0f172a" />
                <link rel="canonical" href={appUrl} />

                {/* Schema JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: comicSeriesJsonLd }}
                />
            </head>
            <body className={`${inter.className}`}>
                <ProviderLayout>{children}</ProviderLayout>
            </body>

            <GoogleAnalytics
                gaId={Env.NEXT_PUBLIC_ANALYTICS_ID || "G-JPMWQ38V8V"}
            />
        </html>
    );
}
