import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Sign In — HireLoop",
};

export default function SignInPage() {
  return (
    <main className="dark flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
        <AuthCard mode="sign-in" />
      </div>
    </main>
  );
}
