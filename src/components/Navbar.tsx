"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, User, LogOut, LogIn, UserPlus } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { getActiveUser, logoutUser } from "@/lib/storage";
import type { UserAccount } from "@/lib/types";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<UserAccount | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setActiveUser(getActiveUser());
    };
    update();
    window.addEventListener("auth-change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("auth-change", update);
      window.removeEventListener("storage", update);
    };
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    setActiveUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-emerald-500 text-white shadow-md shadow-primary-500/25">
            <Compass className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
            Smart Career Path
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              pathname === "/"
                ? "bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              pathname === "/dashboard"
                ? "bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/assessment"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              pathname === "/assessment"
                ? "bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Assessment
          </Link>
          <Link
            href="/compare"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              pathname === "/compare"
                ? "bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Compare
          </Link>
        </nav>

        {/* Right Actions: Theme Toggle + Auth Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {mounted && activeUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-primary-300 dark:hover:border-primary-500/50 transition btn-3d"
                title="View your World Profile"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                  {activeUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold">{activeUser.name}</span>
                <span className="hidden lg:inline text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-950 px-1.5 py-0.5 rounded-md">
                  Profile
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs sm:text-sm font-medium transition btn-3d"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition btn-3d"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/25 transition btn-3d"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
