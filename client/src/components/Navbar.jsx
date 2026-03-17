import { useAuth } from '../context/AuthContext';
import Button from './Button';
import styles from './Navbar.module.css';

export default function Navbar({ onAuthClick }) {
  const { user, logout } = useAuth();

  return (
    <header className={styles.navbar}>
      <span className={styles.logo}>DufilShelf</span>
      <nav className={styles.controls}>
        {user ? (
          <>
            <span className={styles.welcome}>Welcome, {user.email}</span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={onAuthClick}>
            Login / Register
          </Button>
        )}
      </nav>
    </header>
  );
}
