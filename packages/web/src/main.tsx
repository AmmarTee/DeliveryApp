import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

interface Order {
  id: number;
  items: string[];
}

const channel = new BroadcastChannel('orders');

type Role = 'customer' | 'merchant' | null;

type Role = 'customer' | 'merchant';

interface Order {
  id: number;
  item: string;
}

const orderChannel = new BroadcastChannel('orders');

function App() {
  const [role, setRole] = useState<Role>(null);
  const [text, setText] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    channel.onmessage = (e) => {
      setOrders((prev) => [...prev, e.data as Order]);
    };
  }, []);

  if (role === null) {
    return (
      <div dir="auto">
        <button onClick={() => setRole('customer')}>Customer</button>
        <button onClick={() => setRole('merchant')}>Merchant</button>
      </div>
    );
  }

  if (role === 'customer') {
    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = text
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      if (!items.length) return;
      channel.postMessage({ id: Date.now(), items });
      setText('');
    };

    return (
      <form onSubmit={submit} dir="auto">
        <h1>Customer</h1>
        <textarea
          placeholder="One item per line"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>

      </form>
    );
  }

  return (
    <div dir="auto">
      <h1>Merchant</h1>
      {orders.map((o) => (
        <ul key={o.id}>
          {o.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
