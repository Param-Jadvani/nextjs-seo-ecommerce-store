// /app/(auth)/signup/layout.tsx
import type { Metadata } from "next";
import React from "react";
import { SITE_NAME } from "@/utils/seo";

export const metadata: Metadata = {
    title: `Sign Up - ${SITE_NAME}`,
    description:
        "Create a new NextJs SEO E-Commerce Shop account to start shopping and enjoy exclusive benefits.",
    alternates: {
        canonical: "/signup",
    },
    openGraph: {
        title: `Sign Up - ${SITE_NAME}`,
        description: "Join NextJs SEO E-Commerce Shop and start your shopping journey.",
        url: "/signup",
    },
    twitter: {
        title: `Sign Up - ${SITE_NAME}`,
        description: "Create a new NextJs SEO E-Commerce Shop account.",
    },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
