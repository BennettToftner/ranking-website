'use client';

import { authClient } from "@/utils/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {

    const { data: session } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/lists");
        }
    }, [session, router]);

    async function login(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const { data, error } = await authClient.signIn.email({
            email: email,
            password: password,
            fetchOptions: {
                onError: (ctx) => {
                    console.log(ctx.error.message);
                },
                onSuccess: async () => {
                    console.log("Successfully signed up");
                },
            },
        });
    }

    return (
    <div>
        <form onSubmit={login}>
            <label>
                Email:
                <input type="email" name="email"/>
            </label>
            <label>
                Password:
                <input type="password" name="password"/>
            </label>
            <input type="submit" value="Submit" />
        </form>
    </div>
    );
}
