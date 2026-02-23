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

    async function signup(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const { data, error } = await authClient.signUp.email({
            name: name,
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
        <form onSubmit={signup}>
            <label>
                Name:
                <input type="text" name="name"/>
            </label>
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
