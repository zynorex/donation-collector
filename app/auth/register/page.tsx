"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    universityId: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Account created successfully! Please log in.");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-brutal-blue border-3 border-black shadow-brutal-sm flex items-center justify-center">
              <span className="font-heading text-2xl font-bold text-white">+</span>
            </div>
          </div>
          <CardTitle className="text-3xl uppercase">Create Account</CardTitle>
          <p className="text-brutal-charcoal font-sans text-sm mt-2">Enter your details below to join UniFund</p>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-label">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-label">University Email</Label>
              <Input id="email" type="email" placeholder="student@university.edu" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="universityId" className="text-label">Student ID</Label>
              <Input id="universityId" placeholder="19ABC1234" value={formData.universityId} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-label">Password</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up →"}
            </Button>
            <div className="text-sm text-center text-brutal-charcoal font-sans">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-brutal-blue hover:underline underline-offset-2">Log in</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
