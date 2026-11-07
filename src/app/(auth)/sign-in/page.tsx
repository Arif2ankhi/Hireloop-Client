"use client";
import { AuthCard } from "@/components/auth/auth-card";
import { authClient } from "@/lib/auth-client";


export default function SignInPage() {

    const handleSignIn = async (data: Record<string, string>) => {
        const { data: SignInResponse, error } = await authClient.signIn.email({
    email: data.email, // required, The email address of the user.
    password: data.password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
    rememberMe: true, // If false, the user will be signed out when the browser is closed. (optional) (default: true)
    callbackURL: "/", // An optional URL to redirect to after the user signs in. (optional)
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
