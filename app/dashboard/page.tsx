import Link from "next/link";
import { redirect } from "next/navigation";

import { createTravelAction, type TravelStatus } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const travels = await prisma.travel.findMany({
    where: {
      OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
    },
    include: {
      activities: true,
      expenses: true,
      reservations: true,
      members: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalBudget = travels.reduce(
    (sum, trip) => sum + trip.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0),
    0,
  );

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h2>Tableau de bord</h2>
          <p>Bienvenue, {user.name ?? user.email}. Votre plan actuel : <strong>{user.plan}</strong></p>
        </div>

        <div className="summary-grid">
          <div className="stat"><span>Voyages</span><strong>{travels.length}</strong></div>
          <div className="stat"><span>Budget total</span><strong>{totalBudget.toFixed(2)} €</strong></div>
          <div className="stat"><span>Réservations</span><strong>{travels.reduce((sum, trip) => sum + trip.reservations.length, 0)}</strong></div>
        </div>

        <div className="form-shell" style={{ marginTop: 26 }}>
          <div className="form-box">
            <h3>Créer un voyage</h3>
            <form action={createTravelAction} className="form-grid">
              <div className="field">
                <label htmlFor="title">Titre</label>
                <input id="title" name="title" type="text" placeholder="Ex. Week-end à Lisbonne" required />
              </div>
              <div className="field">
                <label htmlFor="destination">Destination</label>
                <input id="destination" name="destination" type="text" placeholder="Ex. Lisbonne" required />
              </div>
              <div className="grid-two">
                <div className="field">
                  <label htmlFor="startDate">Date de départ</label>
                  <input id="startDate" name="startDate" type="date" required />
                </div>
                <div className="field">
                  <label htmlFor="endDate">Date de retour</label>
                  <input id="endDate" name="endDate" type="date" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="travelers">Nombre de voyageurs</label>
                <input id="travelers" name="travelers" type="number" min={1} defaultValue={1} required />
              </div>
              <div className="form-actions">
                <button className="button button-primary" type="submit">Créer le voyage</button>
              </div>
            </form>
          </div>

          <div className="form-box">
            <h3>Plan actuel</h3>
            <div className="feature-list" style={{ marginTop: 12 }}>
              <li>Gratuit : 1 voyage actif</li>
              <li>Premium : 4,99 € / mois</li>
              <li>Pro : 9,99 € / mois</li>
            </div>
            <div className="form-actions" style={{ marginTop: 18 }}>
              <Link href="/pricing" className="button button-secondary">Mettre à niveau</Link>
            </div>
          </div>
        </div>

        <div className="travel-list">
          {travels.length === 0 ? (
            <div className="card">
              <p>Vous n'avez pas encore de voyage. Créez votre premier itinéraire pour commencer.</p>
            </div>
          ) : (
            travels.map((trip) => (
              <article key={trip.id} className="travel-card">
                <div>
                  <h3>{trip.title}</h3>
                  <p>{trip.destination}</p>
                  <div className="travel-meta">
                    <span>{new Date(trip.startDate).toLocaleDateString("fr-FR")}</span>
                    <span>→</span>
                    <span>{new Date(trip.endDate).toLocaleDateString("fr-FR")}</span>
                    <span>• {trip.travelers} voyageurs</span>
                  </div>
                </div>
                <div className="form-actions">
                  <Link href={`/travel/${trip.id}`} className="button button-primary">Ouvrir</Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
