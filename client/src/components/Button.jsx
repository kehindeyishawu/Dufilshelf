import styles from './Button.module.css';

export default function Button({ variant = 'primary', children, className = '', ...rest }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
