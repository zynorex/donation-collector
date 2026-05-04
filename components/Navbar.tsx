"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-brutal-black text-white border-b-4 border-brutal-lime sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-block w-3 h-3 bg-brutal-lime border-2 border-white rotate-45 group-hover:rotate-[135deg] transition-transform duration-300" />
          <span className="font-heading text-xl font-bold uppercase tracking-tight text-white">
            Uni<span className="text-brutal-lime">Fund</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex gap-1 items-center">
          <Link
            href="/events"
            className="px-3 py-2 font-heading text-sm font-bold uppercase tracking-wider text-white hover:text-brutal-lime transition-colors duration-150"
          >
            Events
          </Link>

          {session ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-2 font-heading text-sm font-bold uppercase tracking-wider text-white hover:text-brutal-lime transition-colors duration-150"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="px-3 py-2 font-heading text-sm font-bold uppercase tracking-wider text-white hover:text-brutal-lime transition-colors duration-150"
              >
                Dashboard
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 bg-transparent text-white border-white hover:bg-white hover:text-brutal-black"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-brutal-lime border-transparent"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="ml-1">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
