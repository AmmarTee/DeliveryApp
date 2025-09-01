import { useState } from "react";

export default function Landing() {
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [sent, setSent] = useState(false);

  async function submit() {
    await fetch(`/api/auth/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
    setSent(true);
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <header style={{ position: "sticky", top: 0, background: "white", padding: 16, display: "flex", justifyContent: "space-between" }}>
        <div>GrocerGo</div>
        <div>
          <button>Join as Customer</button>
          <button style={{ marginLeft: 8 }}>Join as Merchant</button>
        </div>
      </header>
      <section style={{ minHeight: "70vh", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#f8fafc,#eef2ff)" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 48, marginBottom: 8 }}>Get groceries from nearby shops</h1>
          <p style={{ fontSize: 18, opacity: 0.8 }}>One request. One accepting merchant. Doorstep delivery.</p>
          <div style={{ marginTop: 24 }}>
            <input placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} />
            <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} style={{ marginLeft: 8 }} />
            <button onClick={submit} style={{ marginLeft: 8 }}>Call me</button>
          </div>
          {sent && <p>Code sent. Check your phone.</p>}
        </div>
      </section>
      <section style={{ padding: 32 }}>
        <h2>How it works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          <Card title="Request" text="Add items and send" />
          <Card title="Accept" text="Nearby shops get notified" />
          <Card title="Deliver" text="Merchant rider brings it" />
        </div>
      </section>
      <footer style={{ padding: 16, textAlign: "center" }}>© GrocerGo</footer>
    </div>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ background: "white", padding: 16, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
