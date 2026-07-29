import { openGraph } from "@/utils/openGraphMeta";
import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
    title: "Checkout",
    description: "Complete your purchase securely at NextJs SEO E-Commerce Shop.",
    alternates: {
        canonical: "/checkout",
        languages: {
            "en-US": new URL("/checkout", SITE_URL).toString(),
        },
    },
    robots: { index: false, follow: false },
    openGraph: {
        ...openGraph,
        title: "Checkout - NextJs SEO E-Commerce Shop",
        url: "/checkout",
        description: "Complete your purchase securely at NextJs SEO E-Commerce Shop.",
    },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto px-4 py-8">{children}</div>;
}
