"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="topbar">
      <div className="container nav-shell">
        <Link href="/" className="brand">TravelPlan</Link>

        <nav className="nav-links">
          <Link href="/">Accueil</Link>
          <Link href="/pricing">Tarifs</Link>
          {status === "authenticated" && <Link href="/dashboard">Dashboard</Link>}
          {status === "authenticated" && session?.user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
        </nav>

        <div className="nav-actions">
          {status === "authenticated" ? (
            <>
              <span className="mini-label">{session.user?.name ?? session.user?.email}</span>
              <button className="button button-secondary" onClick={() => signOut({ callbackUrl: "/" })}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="button button-secondary">Connexion</Link>
              <Link href="/register" className="button button-primary">S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
