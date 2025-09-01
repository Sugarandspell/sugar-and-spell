// api/get-prices.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    // Hole alle aktiven Preise + Produktinfos
    const prices = await stripe.prices.list({
      expand: ["data.product"],
      active: true,
      limit: 100,
    });

    // Schöne Struktur für dein Frontend
    const formatted = prices.data.map((p) => ({
      id: p.id, // Stripe-Preis-ID
      product: p.product.name, // Produktname
      description: p.product.description, // Produktbeschreibung
      unit_amount: p.unit_amount / 100, // Stripe gibt Cent zurück → wir machen Euro draus
      currency: p.currency.toUpperCase(), // EUR statt eur
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: err.message });
  }
}
