import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import Button from '../components/Button';
import styles from './Home.module.css';

export default function Home() {
  const { onAuthClick } = useOutletContext();
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    async function fetchItems() {
      setLoading(true);
      setError('');
      try {
        const url = search
          ? `/api/items?search=${encodeURIComponent(search)}`
          : '/api/items';
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError('Could not load products.');
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
    return () => controller.abort();
  }, [token, search]);

  if (!token) {
    return (
      <div className={styles.unauthenticated}>
        <h2 className={styles.unauthTitle}>Your product inventory, all in one place.</h2>
        <p className={styles.unauthDesc}>Log in or create an account to start managing your products.</p>
        <Button variant="primary" onClick={onAuthClick}>
          Login / Register
        </Button>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />
        <Link to="/add">
          <Button variant="primary">+ Add Product</Button>
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p className={styles.statusText}>Loading…</p>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <p>{search ? `No products matching "${search}".` : 'No products yet.'}</p>
          {!search && (
            <Link to="/add">
              <Button variant="outline" style={{ marginTop: '0.75rem' }}>
                Add your first product
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
