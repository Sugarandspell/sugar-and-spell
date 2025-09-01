// api/get-prices.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Dieselben Produkt-IDs wie im Frontend und dieselben Price-IDs wie in create-checkout-session.js
const PRICE_MAP = {
  "warum-kein-kontakt": "price_1S2QLQEkmI8xFkQvQUqkPRZr",
  "seelenimpuls": "price_1S2QKaEkmI8xFkQv7mGRI0TV",
  "entscheidungshilfe": "price_1S2QJKEkmI8xFkQvOJeNfeWU",
  "monatsbotschaft": "price_1S2QHIEkmI8xFkQvrzEhUaSX",
  "gedanken-gefuehle": "price_1S2QGZEkmI8xFkQv0BrJbA2x",
  "beruf-finanzen": "price_1S2QFlEkmI8xFkQvmFbQ68Mb",
  "mini-botschaft": "price_1S2QEQEkmI8xFkQvHuLROzTI",
  "jahreslegung-12m": "price_1S2QCfEkmI8xFkQvQBwkM0XX",
  "botschaft-universum": "price_1S2QBtEkmI8xFkQvmilK5Wte",
  "liebeslegung-singles": "price_1S2QAzEkmI8xFkQvlYApwOs5",
  "drei-monate": "price_1S2Q45EkmI8xFkQvMtheLP8x",
  "liebeslegung-5": "price_1S2Q2GEkmI8xFkQvMCF148KC",
};

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }
  try {
    // Für jede Produkt-ID die Stripe-Price holen
    const entries = await Promise.all(
      Object.entries(PRICE_MAP).map(async ([productId, priceId]) => {
        const price = await stripe.prices.retrieve(priceId);
        // unit_amount ist in CENT – in EUR umrechnen
        const amountEur = (price.unit_amount || 0) / 100;
        return [productId, amountEur];
      })
    );

    const map = Object.fromEntries(entries);
    res.status(200).json({ prices: map });
  } catch (e) {
    console.error("get-prices error", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};
