import Link from "next/link";
import { redirect } from "next/navigation";

import {
  addActivityAction,
  addExpenseAction,
  addLuggageItemAction,
  addNotificationAction,
  addReservationAction,
  shareTravelAction,
  toggleLuggageItemAction,
} from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TravelDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const travel = await prisma.travel.findFirst({
    where: {
      id: params.id,
      OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
    },
    include: {
      activities: true,
      expenses: true,
      reservations: true,
      luggageItems: true,
      notifications: true,
      members: true,
    },
  });

  if (!travel) {
    redirect("/dashboard");
  }

  const totalExpenses = travel.expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h2>{travel.title}</h2>
          <p>{travel.destination} • {new Date(travel.startDate).toLocaleDateString("fr-FR")} → {new Date(travel.endDate).toLocaleDateString("fr-FR")}</p>
        </div>

        <div className="summary-grid">
          <div className="stat"><span>Voyageurs</span><strong>{travel.travelers}</strong></div>
          <div className="stat"><span>Budget</span><strong>{totalExpenses.toFixed(2)} €</strong></div>
          <div className="stat"><span>Réservations</span><strong>{travel.reservations.length}</strong></div>
        </div>

        <div className="detail-layout">
          <div className="form-grid">
            <div className="form-box">
              <h3>Ajouter une activité</h3>
              <form action={addActivityAction} className="form-grid">
                <input type="hidden" name="travelId" value={travel.id} />
                <div className="field"><label>Nom</label><input name="title" type="text" required /></div>
                <div className="grid-two">
                  <div className="field"><label>Date</label><input name="date" type="date" required /></div>
                  <div className="field"><label>Coût</label><input name="cost" type="number" step="0.01" min="0" defaultValue={0} /></div>
                </div>
                <div className="field"><label>Lieu</label><input name="location" type="text" /></div>
                <div className="field"><label>Notes</label><textarea name="notes" /></div>
                <button className="button button-primary" type="submit">Ajouter</button>
              </form>
            </div>

            <div className="form-box">
              <h3>Ajouter une dépense</h3>
              <form action={addExpenseAction} className="form-grid">
                <input type="hidden" name="travelId" value={travel.id} />
                <div className="field">
                  <label>Catégorie</label>
                  <select name="category">
                    <option value="Hébergement">Hébergement</option>
                    <option value="Transport">Transport</option>
                    <option value="Repas">Repas</option>
                    <option value="Activités">Activités</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="grid-two">
                  <div className="field"><label>Montant</label><input name="amount" type="number" step="0.01" min="0" required /></div>
                  <div className="field"><label>Note</label><input name="note" type="text" /></div>
                </div>
                <button className="button button-primary" type="submit">Enregistrer</button>
              </form>
            </div>

            <div className="form-box">
              <h3>Ajouter une réservation</h3>
              <form action={addReservationAction} className="form-grid">
                <input type="hidden" name="travelId" value={travel.id} />
                <div className="grid-two">
                  <div className="field">
                    <label>Type</label>
                    <select name="type">
                      <option value="HOTEL">Hotel</option>
                      <option value="FLIGHT">Avion</option>
                      <option value="TRANSPORT">Transport</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Statut</label>
                    <select name="status">
                      <option value="confirmé">Confirmé</option>
                      <option value="en attente">En attente</option>
                      <option value="annulé">Annulé</option>
                    </select>
                  </div>
                </div>
                <div className="field"><label>Libellé</label><input name="title" type="text" required /></div>
                <div className="field"><label>Détails</label><textarea name="details" /></div>
                <div className="grid-two">
                  <div className="field"><label>Date</label><input name="date" type="date" /></div>
                  <div className="field"><label>Montant</label><input name="amount" type="number" step="0.01" min="0" defaultValue={0} /></div>
                </div>
                <button className="button button-primary" type="submit">Ajouter</button>
              </form>
            </div>

            <div className="form-box">
              <h3>Ajouter un bagage</h3>
              <form action={addLuggageItemAction} className="form-grid">
                <input type="hidden" name="travelId" value={travel.id} />
                <div className="field"><label>Élément</label><input name="name" type="text" placeholder="Ex. Passeport, lunettes" required /></div>
                <button className="button button-primary" type="submit">Ajouter à la liste</button>
              </form>
            </div>
          </div>

          <div className="form-grid">
            <div className="list-box">
              <h3>Activités</h3>
              <ul>
                {travel.activities.length === 0 ? <li>Aucune activité pour le moment.</li> : travel.activities.map((activity) => (
                  <li key={activity.id}><strong>{activity.title}</strong><div>{new Date(activity.date).toLocaleDateString("fr-FR")}</div><div>{activity.location}</div></li>
                ))}
              </ul>
            </div>

            <div className="list-box">
              <h3>Dépenses</h3>
              <ul>
                {travel.expenses.length === 0 ? <li>Aucune dépense ajoutée.</li> : travel.expenses.map((expense) => (
                  <li key={expense.id}><strong>{expense.category}</strong><div>{expense.amount} €</div><div>{expense.note}</div></li>
                ))}
              </ul>
            </div>

            <div className="list-box">
              <h3>Réservations</h3>
              <ul>
                {travel.reservations.length === 0 ? <li>Aucune réservation.</li> : travel.reservations.map((reservation) => (
                  <li key={reservation.id}><strong>{reservation.title}</strong><div>{reservation.type} • {reservation.status}</div><div>{reservation.amount ?? 0} €</div></li>
                ))}
              </ul>
            </div>

            <div className="list-box">
              <h3>Bagages</h3>
              <ul>
                {travel.luggageItems.length === 0 ? <li>La liste est vide.</li> : travel.luggageItems.map((item) => (
                  <li key={item.id}>
                    <form action={toggleLuggageItemAction} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <input type="hidden" name="travelId" value={travel.id} />
                      <input type="hidden" name="itemId" value={item.id} />
                      <span>{item.name}</span>
                      <button className="button button-secondary" type="submit">
                        {item.packed ? "Décocher" : "Cocher"}
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>

            <div className="list-box">
              <h3>Notifications</h3>
              <form action={addNotificationAction} className="form-grid">
                <input type="hidden" name="travelId" value={travel.id} />
                <div className="field"><label>Message</label><input name="message" type="text" placeholder="Rappel de réservation" required /></div>
                <div className="field"><label>Programmée pour</label><input name="scheduledFor" type="datetime-local" /></div>
                <button className="button button-primary" type="submit">Créer un rappel</button>
              </form>
              <ul style={{ marginTop: 16 }}>
                {travel.notifications.length === 0 ? <li>Aucune notification.</li> : travel.notifications.map((notification) => (
                  <li key={notification.id}><strong>{notification.message}</strong></li>
                ))}
              </ul>
            </div>

            <div className="list-box">
              <h3>Partager le voyage</h3>
              <form action={shareTravelAction} className="form-grid">
                <input type="hidden" name="travelId" value={travel.id} />
                <div className="field"><label>Email du participant</label><input name="email" type="email" placeholder="ami@exemple.com" required /></div>
                <button className="button button-primary" type="submit">Partager</button>
              </form>
              <ul style={{ marginTop: 16 }}>
                {travel.members.length === 0 ? <li>Aucun participant partagé.</li> : travel.members.map((member) => (
                  <li key={member.id}>{member.email}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <Link href="/dashboard" className="button button-secondary">Retour au dashboard</Link>
        </div>
      </div>
    </section>
  );
}
