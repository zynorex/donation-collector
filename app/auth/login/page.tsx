"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Logged in successfully");
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-brutal-lime border-3 border-black shadow-brutal-sm flex items-center justify-center">
              <span className="font-heading text-2xl font-bold">U</span>
            </div>
          </div>
          <CardTitle className="text-3xl uppercase">Welcome Back</CardTitle>
          <p className="text-brutal-charcoal font-sans text-sm mt-2">
            Enter your email to sign in to your account
          </p>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-label">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-label">Password</Label>
                <Link href="#" className="text-xs font-heading font-bold uppercase text-brutal-blue hover:underline underline-offset-2">
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </Button>
            <div className="text-sm text-center text-brutal-charcoal font-sans">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-bold text-brutal-blue hover:underline underline-offset-2">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
