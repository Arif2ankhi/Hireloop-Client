"use client";
import { AuthCard } from "@/components/auth/auth-card";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

/** Reads ?redirectTo= (added by the Apply Now sign-in gate). */
function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  const handleSignIn = async (data: Record<string, string>) => {
    const { data: SignInResponse, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
      callbackURL: redirectTo,
    });
    console.log("sign in rrsponse", SignInResponse, error);
  };

  return <AuthCard mode="sign-in" onSubmit={handleSignIn} />;
}

export default function SignInPage() {
  // useSearchParams opts the route out of static prerender unless the
  // reading component is inside a Suspense boundary.
  return (
    <main className="dark flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
