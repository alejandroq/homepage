import styles from './CreatedUpdatedText.module.css';

export default function CreatedUpdatedText({ createdAt, updatedAt }) {
    return <p className={styles.subtext}>Created {createdAt} | Updated {updatedAt}</p>
}
