// /app/(main)/profile/page.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, LogOut, ArrowLeft } from "lucide-react";
import { logoutAction } from "@/actions/auth/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import userStore from "@/store/userStore";

export default function ProfilePage() {
    const router = useRouter();
    const { user, logout: logoutInStore } = userStore((s) => s);

    const handleLogout = async () => {
        try {
            toast.promise(
                (async () => {
                    const result = await logoutAction();
                    if (result?.error) throw new Error(result.error);
                    return result;
                })(),
                {
                    loading: "Logging out...",
                    success: () => {
                        logoutInStore();
                        router.push("/login");
                        return "Logged out successfully!";
                    },
                    error: (err) => err.message || "Logout failed. Please try again.",
                }
            );
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unknown error occurred";
            console.error("Logout failed:", message);
            toast.error("Logout Failed", {
                description: message,
            });
        }
    };

    const getAvatarLetter = () => {
        return user?.username?.charAt(0).toUpperCase() || "?";
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center"
                    onClick={() => router.push("/")}
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Home
                </Button>
            </div>
            <h1 className="text-3xl font-bold mb-8">Your Profile</h1>{" "}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="text-center pb-4">
                            <div className="flex flex-col items-center">
                                <Avatar className="h-24 w-24 mb-4 text-3xl">
                                    <AvatarFallback className="bg-blue-600 text-white font-semibold">
                                        {getAvatarLetter()}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-xl">
                                    {user?.username || "Username"}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 text-gray-700">
                                    <User size={18} className="text-muted-foreground" />
                                    <span>{user?.username || "N/A"}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-700">
                                    <Mail size={18} className="text-muted-foreground" />
                                    <span>{user?.email || "N/A"}</span>
                                </div>
                                <Button
                                    variant="destructive"
                                    className="w-full mt-6"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={18} className="mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl">Account Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-5">
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500 mb-1">
                                        Username
                                    </h3>
                                    <p className="text-gray-800 text-lg">
                                        {user?.username || "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500 mb-1">
                                        Email Address
                                    </h3>
                                    <p className="text-gray-800 text-lg">
                                        {user?.email || "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500 mb-1">
                                        Account ID
                                    </h3>
                                    <p className="text-gray-800 text-lg break-all">
                                        {user?.id || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
