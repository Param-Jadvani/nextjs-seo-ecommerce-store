import { SignupForm } from "@/components/auth/SignupForm";
import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="w-full max-w-md">
            <SignupForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    Login
                </Link>
            </p>
        </div>
    );
}
