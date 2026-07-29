import { openGraph } from "@/utils/openGraphMeta";
import { Metadata } from "next";
import { SITE_URL_OBJECT } from "@/utils/seo";

export const metadata: Metadata = {
    title: "Checkout",
    description: "Complete your purchase securely at NextJs SEO E-Commerce Store.",
    alternates: {
        canonical: "/checkout",
        languages: {
            "en-US": new URL("/checkout", SITE_URL_OBJECT).toString(),
        },
    },
    robots: { index: false, follow: false },
    openGraph: {
        ...openGraph,
        title: "Checkout - NextJs SEO E-Commerce Store",
        url: "/checkout",
        description: "Complete your purchase securely at NextJs SEO E-Commerce Store.",
    },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto px-4 py-8">{children}</div>;
}
