"use client"

import { AuthCard } from "@/components/auth/auth-card";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
    const handleSignup = async (data: Record<string, string>) => {
        const { data: signUpResponse, error } = await authClient.signUp.email({
            name: data.name, // required, The name of the user.
            email: data.email, // required, The email address of the user.
            password: data.password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
            role: data.role ?? "seeker", // seeker | recruiter | admin (stored as an additional user field server-side)
            callbackURL: "/", // An optional URL to redirect to after the user signs up.
        } as Parameters<typeof authClient.signUp.email>[0]);
        console.log('signup response', signUpResponse, error); // signUpResponse contains { token, user } on success
    };

  return (
    <main className="dark flex min-h-full flex-col">
       <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
        <AuthCard mode="sign-up" onSubmit={handleSignup} />
       </div>
     </main>
  );
}
