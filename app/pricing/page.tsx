import Link from "next/link";

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    description: "Pour commencer à organiser vos voyages simples.",
    features: ["1 voyage actif", "Gestion de base", "Liste des bagages", "Rappels essentiels"],
    accent: false,
  },
  {
    name: "Premium",
    price: "4,99€",
    description: "Idéal pour les voyages fréquents et les plans plus détaillés.",
    features: ["4 voyages actifs", "Budget avancé", "Partage jusqu'à 5 participants", "Notifications personnalisées"],
    accent: true,
  },
  {
    name: "Pro",
    price: "9,99€",
    description: "Pour les voyageurs réguliers, les équipes et les séjours complexes.",
    features: ["Voyages illimités", "Collaborations complètes", "Administration avancée", "Accès prioritaire aux fonctionnalités"],
    accent: false,
  },
];

export default function PricingPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading" style={{ textAlign: "center" }}>
          <h2>Des abonnements adaptés à chaque type de voyage</h2>
          <p>Choisissez le plan qui correspond à votre style de voyage.</p>
        </div>

        <div className="plan-row">
          {plans.map((plan) => (
            <article key={plan.name} className="pricing-card" style={plan.accent ? { borderColor: "rgba(62,163,255,0.8)", background: "rgba(31,141,247,0.08)" } : {}}>
              <div className="pill">{plan.name}</div>
              <h3>{plan.name}</h3>
              <div className="price">{plan.price}<span>/mois</span></div>
              <p>{plan.description}</p>
              <ul className="feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div style={{ marginTop: 16 }}>
                <Link href={`/register?plan=${plan.name.toUpperCase()}`} className="button button-primary">
                  Choisir {plan.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
