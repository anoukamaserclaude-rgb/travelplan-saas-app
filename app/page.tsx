import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const user = await getCurrentUser();

  const userCount = await prisma.user.count();
  const travelCount = await prisma.travel.count();
  const totalExpenses = await prisma.expense.aggregate({ _sum: { amount: true } });

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="pill">Nouveau • SaaS de voyage</div>
            <h1>Planifiez des voyages élégants, simples et complets.</h1>
            <p>
              TravelPlan centralise les destinations, les activités, le budget, les réservations,
              les bagages et les rappels pour que chaque voyage soit bien organisé.
            </p>
            <div className="hero-actions">
              <Link href={user ? "/dashboard" : "/register"} className="button button-primary">
                {user ? "Accéder au dashboard" : "Créer mon compte"}
              </Link>
              <Link href="/pricing" className="button button-secondary">Voir les tarifs</Link>
            </div>
            <div className="badges">
              <span className="badge">Sécurité avancée</span>
              <span className="badge">Partage simple</span>
              <span className="badge">Responsive</span>
            </div>
          </div>

          <div className="hero-panel">
            <div className="trip-mini">
              <div className="trip-mini-header">
                <strong>Voyage à Tokyo</strong>
                <span className="pill">Planifié</span>
              </div>
              <div className="mini-row"><span>Dates</span><strong>12-22 Mai</strong></div>
              <div className="mini-row"><span>Budget</span><strong>2,450 €</strong></div>
              <div className="mini-row"><span>Réservations</span><strong>4 confirmées</strong></div>
            </div>
            <div className="trip-mini">
              <div className="trip-mini-header">
                <strong>Paris Weekend</strong>
                <span className="pill">À venir</span>
              </div>
              <div className="mini-row"><span>Activités</span><strong>7 détails</strong></div>
              <div className="mini-row"><span>Bagages</span><strong>8/10 prêts</strong></div>
              <div className="mini-row"><span>Partage</span><strong>3 participants</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Tout pour organiser vos voyages sans friction</h2>
            <p>Des outils pensés pour les voyages solo, en couple ou en groupe.</p>
          </div>

          <div className="grid-3">
            <article className="card">
              <h3>Planning jour par jour</h3>
              <p>Ajoutez des activités, lieux, notes et budgets pour chaque étape du voyage.</p>
            </article>
            <article className="card">
              <h3>Budget & dépenses</h3>
              <p>Suivez vos achats, catégories et écarts pour rester serein financièrement.</p>
            </article>
            <article className="card">
              <h3>Réservations centralisées</h3>
              <p>Gérez hôtels, vols et transports dans un seul espace, avec dates et statuts.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Des statistiques utiles</h2>
          </div>

          <div className="summary-grid">
            <div className="stat"><span>Utilisateurs actifs</span><strong>{userCount}</strong></div>
            <div className="stat"><span>Voyages créés</span><strong>{travelCount}</strong></div>
            <div className="stat"><span>Budget total</span><strong>{Number(totalExpenses._sum.amount ?? 0).toFixed(2)} €</strong></div>
          </div>
        </div>
      </section>
    </>
  );
}
