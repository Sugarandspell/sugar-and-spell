// src/checkout.js
export async function startCheckout(productId, onError) {
  try {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `Fehler ${res.status}`);
    }

    const data = await res.json();
    if (data?.url) {
      // Browser zur Stripe-Kasse schicken
      window.location.href = data.url;
    } else {
      throw new Error("Keine Checkout-URL erhalten");
    }
  } catch (e) {
    console.error(e);
    if (onError) onError(e);
    else alert("Zahlung konnte nicht gestartet werden: " + e.message);
  }
}
