"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-navy text-white shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gold">
          UniFund
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/events" className="hover:text-gold transition">
            Events
          </Link>
          {session ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin/dashboard" className="hover:text-gold transition">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="hover:text-gold transition">
                Dashboard
              </Link>
              <Button
                variant="outline"
                className="text-navy border-navy hover:bg-navy/10"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="hover:text-gold">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gold text-navy hover:bg-gold/90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
