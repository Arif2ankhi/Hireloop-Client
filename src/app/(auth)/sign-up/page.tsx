"use client"

import { AuthCard } from "@/components/auth/auth-card";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
    // The redirect to "/" after a successful signup is handled by AuthCard.
    // Throwing here surfaces better-auth's real message (e.g. "User already
    // exists. Use another email.") in the card's error banner and keeps the
    // user on the page.
    const handleSignup = async (data: Record<string, string>) => {
        const { data: signUpResponse, error } = await authClient.signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role ?? "seeker", // seeker | recruiter | admin (stored as an additional user field server-side)
            callbackURL: "/", // where better-auth sends the user after flows like email verification
        } as Parameters<typeof authClient.signUp.email>[0]);
        console.log('signup response', signUpResponse, error); // { token, user } on success
        if (error) throw new Error(error.message || "Sign up failed");
    };

  return (
    <main className="dark flex min-h-full flex-col">
       <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
        <AuthCard mode="sign-up" onSubmit={handleSignup} />
       </div>
     </main>
  );
}
