import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { productId } = JSON.parse(req.body);

      const priceId = PRICE_MAP[productId];
      if (!priceId) {
        return res.status(400).json({ error: "Produkt nicht gefunden" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.status(200).json({ id: session.id, url: session.url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
