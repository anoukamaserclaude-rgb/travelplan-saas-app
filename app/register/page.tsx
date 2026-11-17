"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
      plan: (searchParams.get("plan") ?? "FREE").toUpperCase(),
    };

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Erreur lors de l'inscription.");
      setLoading(false);
      return;
    }

    const loginResult = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    if (loginResult?.error) {
      setError("Compte créé, mais la connexion automatique a échoué.");
      setLoading(false);
      router.push("/login");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Créer un compte TravelPlan</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label htmlFor="name">Nom complet</label>
            <input id="name" name="name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" minLength={8} required />
          </div>
          <div className="field">
            <label htmlFor="plan">Plan</label>
            <select id="plan" name="plan" defaultValue={(searchParams.get("plan") ?? "FREE").toUpperCase()}>
              <option value="FREE">Gratuit</option>
              <option value="PREMIUM">Premium</option>
              <option value="PRO">Pro</option>
            </select>
          </div>

          {error ? <p style={{ color: "#f87171" }}>{error}</p> : null}

          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p style={{ marginTop: 18, color: "var(--muted)" }}>
          Déjà inscrit ? <Link href="/login">Connexion</Link>
        </p>
      </div>
    </div>
  );
}
