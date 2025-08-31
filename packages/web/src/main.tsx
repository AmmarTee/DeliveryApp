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
  price: number;
  category: string;
}

const ITEMS: Item[] = [
  { id: 'coffee', name: 'Coffee', price: 3, category: 'Beverages' },
  { id: 'tea', name: 'Tea', price: 2, category: 'Beverages' },
  { id: 'sandwich', name: 'Sandwich', price: 5, category: 'Food' },
  { id: 'cake', name: 'Cake', price: 4, category: 'Food' },
];

interface OrderItem {
  item: Item;
  quantity: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  total: number;
}

const channel = new BroadcastChannel('orders');

function loadAccounts(): Account[] {
  try {
    return JSON.parse(localStorage.getItem('accounts') || '[]');
  } catch {
    return [];
  }
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

function loadOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

function App() {
  const [account, setAccount] = useState<Account | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('customer');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const accounts = loadAccounts();
    if (mode === 'signup') {
      if (accounts.find((a) => a.email === email)) {
        alert('Account exists');
        return;
      }
      const newAcc = { email, password, role };
      accounts.push(newAcc);
      saveAccounts(accounts);
      setAccount(newAcc);
    } else {
      const found = accounts.find(
        (a) => a.email === email && a.password === password
      );
      if (!found) {
        alert('Invalid credentials');
        return;
      }
      setAccount(found);
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
        <button type="submit">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
        <p>
          {mode === 'login' ? (
            <span>
              No account? <a onClick={() => setMode('signup')}>Create one</a>
            </span>
          ) : (
            <span>
              Have an account? <a onClick={() => setMode('login')}>Login</a>
            </span>
          )}
        </p>
      </form>
    );
  }

  return <Dashboard account={account} logout={() => setAccount(null)} />;
}

function Dashboard({
  account,
  logout,
}: {
  account: Account;
  logout: () => void;
}) {
  const [section, setSection] = useState<'categories' | 'orders' | 'payments'>(
    'orders'
  );
  return (
    <div dir="auto">
      <nav>
        <button
          className={section === 'categories' ? 'active' : ''}
          onClick={() => setSection('categories')}
        >
          Categories
        </button>
        <button
          className={section === 'orders' ? 'active' : ''}
          onClick={() => setSection('orders')}
        >
          Orders
        </button>
        <button
          className={section === 'payments' ? 'active' : ''}
          onClick={() => setSection('payments')}
        >
          Payments
        </button>
        <span className="spacer" />
        <button onClick={logout}>Logout</button>
      </nav>
      {section === 'categories' && <Categories />}
      {section === 'orders' && account.role === 'customer' && <CustomerOrders />}
      {section === 'orders' && account.role === 'merchant' && <MerchantOrders />}
      {section === 'payments' && <div className="placeholder">Payments coming soon</div>}
    </div>
  );
}

function Categories() {
  const grouped = ITEMS.reduce<Record<string, Item[]>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});
  return (
    <div className="categories">
      {Object.entries(grouped).map(([cat, list]) => (
        <div key={cat}>
          <h2>{cat}</h2>
          <ul>
            {list.map((i) => (
              <li key={i.id}>
                {i.name} - ${i.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CustomerOrders() {
  const [selected, setSelected] = useState<string>(ITEMS[0].id);
  const [qty, setQty] = useState(1);
  const [items, setItems] = useState<OrderItem[]>([]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item = ITEMS.find((i) => i.id === selected)!;
    setItems((prev) => [...prev, { item, quantity: qty }]);
    setQty(1);
  };

  const submitOrder = () => {
    if (!items.length) return;
    const total = items.reduce(
      (s, it) => s + it.item.price * it.quantity,
      0
    );
    const order: Order = { id: Date.now(), items, total };
    const existing = loadOrders();
    saveOrders([...existing, order]);
    channel.postMessage(order);
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
              {i.name} (${i.price})
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
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td>{it.item.name}</td>
                  <td>{it.quantity}</td>
                  <td>${it.item.price * it.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="total">
            Total: $
            {items.reduce((s, it) => s + it.item.price * it.quantity, 0)}
          </p>
          <button onClick={submitOrder}>Send Order</button>
        </>
      )}
    </div>
  );
}

function MerchantOrders() {
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());

  useEffect(() => {
    channel.onmessage = (e) => {
      const order = e.data as Order;
      setOrders((prev) => {
        const next = [...prev, order];
        saveOrders(next);
        return next;
      });
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
                {it.quantity} x {it.item.name} (${it.item.price})
              </li>
            ))}
          </ul>
          <strong>Total: ${o.total}</strong>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
