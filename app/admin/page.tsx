import { redirect } from "next/navigation";

import { updateUserPlanAction, updateUserRoleAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  const stats = {
    users: await prisma.user.count(),
    travels: await prisma.travel.count(),
    premium: await prisma.user.count({ where: { plan: "PREMIUM" } }),
    pro: await prisma.user.count({ where: { plan: "PRO" } }),
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h2>Espace administrateur</h2>
          <p>Gérez les utilisateurs, les plans et les statistiques.</p>
        </div>

        <div className="summary-grid">
          <div className="stat"><span>Utilisateurs</span><strong>{stats.users}</strong></div>
          <div className="stat"><span>Voyages</span><strong>{stats.travels}</strong></div>
          <div className="stat"><span>Plans</span><strong>{stats.premium + stats.pro}</strong></div>
        </div>

        <div className="form-box" style={{ marginTop: 26 }}>
          <h3>Utilisateurs et abonnements</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Abonnement</th>
              </tr>
            </thead>
            <tbody>
              {users.map((account) => (
                <tr key={account.id}>
                  <td>{account.name ?? "Sans nom"}</td>
                  <td>{account.email}</td>
                  <td>
                    <form action={updateUserRoleAction}>
                      <input type="hidden" name="userId" value={account.id} />
                      <select name="role" defaultValue={account.role} onChange={(e) => e.currentTarget.form?.requestSubmit()}>
                        <option value="USER">Utilisateur</option>
                        <option value="ADMIN">Administrateur</option>
                      </select>
                    </form>
                  </td>
                  <td>
                    <form action={updateUserPlanAction}>
                      <input type="hidden" name="userId" value={account.id} />
                      <select name="plan" defaultValue={account.plan} onChange={(e) => e.currentTarget.form?.requestSubmit()}>
                        <option value="FREE">Gratuit</option>
                        <option value="PREMIUM">Premium</option>
                        <option value="PRO">Pro</option>
                      </select>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
