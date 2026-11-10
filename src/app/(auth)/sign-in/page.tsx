"use client";
import { AuthCard } from "@/components/auth/auth-card";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";


export default function SignInPage() {

  const searchParams = useSearchParams()
  const redirectTo =searchParams.get("redirectTo") ?? "/"

    const handleSignIn = async (data: Record<string, string>) => {
        const { data: SignInResponse, error } = await authClient.signIn.email({
    email: data.email,
    password: data.password, 
    rememberMe: true, 
    callbackURL: redirectTo, 
});
console.log('sign in rrsponse', SignInResponse, error);

    }
  return (
    <main className="dark flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
        <AuthCard mode="sign-in" onSubmit={handleSignIn} />
      </div>
    </main>
  );
}
