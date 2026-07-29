// /app/(auth)/login/layout.tsx
import type { Metadata } from "next";
import React from "react";
import { SITE_NAME } from "@/utils/seo";

export const metadata: Metadata = {
    title: `Login - ${SITE_NAME}`,
    description: "Log in to your NextJs SEO E-Commerce Shop account to access your profile, orders, and cart.",
    alternates: {
        canonical: "/login",
    },
    openGraph: {
        title: `Login - ${SITE_NAME}`,
        description: "Access your NextJs SEO E-Commerce Shop account.",
        url: "/login",
    },
    twitter: {
        title: `Login - ${SITE_NAME}`,
        description: "Log in to your NextJs SEO E-Commerce Shop account.",
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
