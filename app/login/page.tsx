"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Identifiants invalides. Vérifiez votre email et votre mot de passe.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Se connecter</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" required />
          </div>

          {error ? <p style={{ color: "#f87171" }}>{error}</p> : null}

          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Connexion"}
          </button>
        </form>

        <p style={{ marginTop: 18, color: "var(--muted)" }}>
          Pas encore inscrit ? <Link href="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
