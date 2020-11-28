import Head from 'next/head';
import Aside from './Aside';
import Header from './Header';
import styles from './Page.module.css';

export default function Page({ title, posts, children }) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Alejandro Quesada - {title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header className={styles.header} />

            <Aside className={styles.sidebar} posts={posts} />

            <main className={styles.main}>{children}</main>
        </div>
    )
}