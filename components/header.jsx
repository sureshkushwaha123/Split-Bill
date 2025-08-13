"use client";

import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useStoreUser } from "@/hooks/use-store-user";
import { BarLoader } from "react-spinners";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

const header = () => {
  const { isLoading } = useStoreUser();
  const path = usePathname();
  return (
    <header className="fixed top-0 w-full border-b bg-white/95 backdrop-blur z-50 supports-backdrop-blur:bg-white/95">
      <nav className="relative w-full px-4 h-16 flex items-center justify-between">
        {/* Logo (left) */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/logo.png"
            alt="splint logo"
            width={200}
            height={60}
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Centered Links */}
        {path === "/" && (
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-green-600 transition"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-green-600 transition"
            >
              How it Works
            </Link>
          </div>
        )}

        {/* Right side - Auth */}
        <div className="flex items-center gap-4">
          <Authenticated>
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-sm font-medium hover:text-green-600 transition"
            >
              <Button variant={"outline"} className="hidden md:inline-flex items-center gap-2 hover:text-green-600 hover:border-green-700
              transition">
                <LayoutDashboard className="h-4 w-4" />
              Dashboard
              </Button>
              <Button variant={"ghost"} className="md:hidden w-10 h-10 p-0">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
            <UserButton/>
          </Authenticated> 

          <Unauthenticated>
            <SignInButton>
              <Button variant={"ghost"} className="cursor-pointer">Sign in</Button>
            </SignInButton>
            <SignUpButton>
              <Button className="bg-green-600 hover:bg-green-700 border-none cursor-pointer">
                Sign up
              </Button>
            </SignUpButton>
          </Unauthenticated>
        </div>
      </nav>

      {isLoading && <BarLoader width={"100%"} color="#36d7b7" />}
    </header>
  );
};

export default header;
