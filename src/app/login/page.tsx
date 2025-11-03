// FINAL-FINAL code for src/app/login/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { account } from "@/lib/appwrite";
import toast from "react-hot-toast";
import { AppwriteException } from "appwrite";
import { CurvyLink } from "@/components/curvy-link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="Maglo Logo" width={120} height={24} />
    </div>
  );
}

export default function LoginPage() {
  const { user, setUser } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      toast.success("Logged in successfully!");
    } catch (error) {
      if (error instanceof AppwriteException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="w-full lg:grid lg:h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center h-screen p-8 lg:justify-between">
        <div className="flex justify-start mb-5">
          <Logo />
        </div>

        <div className="flex items-center justify-center h-full">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2">
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="text-balance text-muted-foreground">
                Welcome back! Please enter your details
              </p>
            </div>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="text-sm font-medium">
                    Remember for 30 Days
                  </label>
                </div>
                <Link href="#" className="inline-block text-sm underline">
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#B4E53B] text-black hover:bg-[#a2d42a] font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign in"}
              </Button>
            </form>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <CurvyLink href="/signup">Sign up for free</CurvyLink>
            </div>
          </div>
        </div>

        <div></div>
      </div>

      <div className="hidden bg-muted lg:block h-screen overflow-hidden">
        <Image
          src="/placeholder-image.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
