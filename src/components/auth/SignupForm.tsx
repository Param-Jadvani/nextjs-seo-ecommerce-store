"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, SignupInput } from "@/schema/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { signupAction } from "@/actions/auth/auth";
import { useRouter } from "next/navigation";
import userStore from "@/store/userStore";
import { UserType } from "@/types/user";

export function SignupForm() {
    const router = useRouter();
    const setUserInStore = userStore((s) => s.setUser);
    const [isPending, startTransition] = useTransition();
    const form = useForm<SignupInput>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: SignupInput) => {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("password", data.password);
        startTransition(async () => {
            try {
                const result = await signupAction(formData);
                if (result.success) {
                    toast.success("Account created!");
                    setUserInStore(result.user as UserType);
                    form.reset();
                    router.replace("/");
                } else {
                    toast.error(result.error);
                }
            } catch (error: unknown) {
                if (error instanceof Error) toast.error(error.message);
                else toast.error("An error occurred during signup.");
            }
        });
    };

    return (
        <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Join us by creating an account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="john-doe"
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Signing up..." : "Sign Up"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
