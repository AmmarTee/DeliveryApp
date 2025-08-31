import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

type Role = 'customer' | 'merchant';

interface Account {
  email: string;
  password: string;
  role: Role;
}

interface Item {
  id: string;
  name: string;
}

const ITEMS: Item[] = [
  { id: 'coffee', name: 'Coffee' },
  { id: 'tea', name: 'Tea' },
  { id: 'sandwich', name: 'Sandwich' },
  { id: 'cake', name: 'Cake' },
];

const channel = new BroadcastChannel('orders');

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('customer');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      if (accounts.find((a) => a.email === email)) {
        alert('Account exists');
        return;
      }
      const acc = { email, password, role };
      setAccounts([...accounts, acc]);
      setAccount(acc);
    } else {
      const acc = accounts.find(
        (a) => a.email === email && a.password === password
      );
      if (!acc) {
        alert('Invalid credentials');
        return;
      }
      setAccount(acc);
    }
  };

  if (!account) {
    return (
      <form onSubmit={submit} className="auth" dir="auto">
        <h1>{mode === 'login' ? 'Login' : 'Create Account'}</h1>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {mode === 'signup' && (
          <div className="role-select">
            <label>
              <input
                type="radio"
                checked={role === 'customer'}
                onChange={() => setRole('customer')}
              />{' '}
              Customer
            </label>
            <label>
              <input
                type="radio"
                checked={role === 'merchant'}
                onChange={() => setRole('merchant')}
              />{' '}
              Merchant
            </label>
          </div>
        )}
        <button type="submit">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
        <p>
          {mode === 'login' ? 'Need an account?' : 'Have an account?'}{' '}
          <a href="#" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </a>
        </p>

      </form>
    );
  }

  return account.role === 'customer' ? <Customer /> : <Merchant />;
}

interface OrderItem {
  id: string;
  qty: number;
}

function Customer() {
  const [selected, setSelected] = useState<string>(ITEMS[0].id);
  const [qty, setQty] = useState(1);
  const [items, setItems] = useState<OrderItem[]>([]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    setItems([...items, { id: selected, qty }]);
    setQty(1);
  };

  const send = () => {
    if (!items.length) return;
    channel.postMessage({ id: Date.now(), items });
    setItems([]);
    alert('Order sent');
  };

  return (
    <div className="orders">
      <h2>Create Order</h2>
      <form onSubmit={addItem} className="add-item">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {ITEMS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value))}
        />
        <button type="submit">Add</button>
      </form>
      {items.length > 0 && (
        <>
          <ul>
            {items.map((it, idx) => (
              <li key={idx}>
                {it.qty} x {ITEMS.find((i) => i.id === it.id)!.name}
              </li>
            ))}
          </ul>
          <button onClick={send}>Send Order</button>
        </>
      )}
    </div>
  );
}

interface Order {
  id: number;
  items: OrderItem[];
}

function Merchant() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    channel.onmessage = (e) => {
      setOrders((o) => [...o, e.data as Order]);
    };
  }, []);

  return (
    <div className="orders">
      <h2>Incoming Orders</h2>
      {orders.map((o) => (
        <div key={o.id} className="order">
          <h3>Order #{o.id}</h3>
          <ul>
            {o.items.map((it, i) => (
              <li key={i}>
                {it.qty} x {ITEMS.find((x) => x.id === it.id)!.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
