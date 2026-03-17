import styles from './ItemCard.module.css';

export default function ItemCard({ item }) {
  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className={styles.card}>
      <h3 className={styles.name}>{item.name}</h3>
      {item.description && (
        <p className={styles.description}>{item.description}</p>
      )}
      <time className={styles.date} dateTime={item.createdAt}>
        Added {formattedDate}
      </time>
    </article>
  );
}
