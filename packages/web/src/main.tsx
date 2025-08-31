import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './i18n/index.ts';

type Role = 'customer' | 'merchant';

interface Order {
  id: number;
  item: string;
}

const orderChannel = new BroadcastChannel('orders');

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [item, setItem] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    orderChannel.onmessage = (e) => {
      setOrders((prev) => [...prev, e.data as Order]);
    };
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setLoggedIn(true);
    }
  };

  const sendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    const newOrder = { id: Date.now(), item };
    orderChannel.postMessage(newOrder);
    setItem('');
  };

  if (!loggedIn) {
    return (
      <form onSubmit={login} dir="auto">
        <h1>Login</h1>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="customer">Customer</option>
          <option value="merchant">Merchant</option>
        </select>
        <button type="submit">Login</button>
      </form>
    );
  }

  if (role === 'customer') {
    return (
      <form onSubmit={sendOrder} dir="auto">
        <h1>Customer Dashboard</h1>
        <input
          placeholder="Order item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <button type="submit">Send Order</button>
      </form>
    );
  }

  return (
    <div dir="auto">
      <h1>Merchant Dashboard</h1>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>{o.item}</li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);

