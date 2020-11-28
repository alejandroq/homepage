import Link from 'next/link';
import styles from './Aside.module.css';

export default function Aside({ className, posts }) {
    return (
        <aside className={className}>
            <strong>Table of Contents</strong>
            <ul className={styles['no-list-type']}>
                {
                    posts.map((post) => <li key={post.id}>
                        <Link href={`/posts/${post.id}`}>
                            {post.title}
                        </Link>
                    </li>)
                }
            </ul>
        </aside>
    )
}