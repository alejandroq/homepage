import Link from 'next/link';
import Image from 'next/image';
import { posts } from '../server';
import Page from '../components/Page';
import CreatedUpdatedText from '../components/CreatedUpdatedText';
import styles from './index.module.css';

export default function Home({ posts }) {
  return (
    <Page title="Homepage" posts={posts}>
      <h2>About Me</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <Image src="/about_me.jpeg" width={300} height={225} />
      <h2>Previews</h2>
      <>
        {
          posts.map(({ id, title, preview, createdAt, updatedAt }) => {
            return (
              <Link href={`/posts/${id}`} key={id}>
                <div className={styles.list}>
                  <CreatedUpdatedText createdAt={createdAt} updatedAt={updatedAt} />
                  <h3>{title}</h3>
                  <div dangerouslySetInnerHTML={{__html: preview}} />
                  <a href="javascript:void(0);">Read more</a>
                </div>
              </Link>
            );
          })
        }
      </>
    </Page>
  )
}

export async function getStaticProps() {
  return {
    props: {
      posts: await (await posts()).get(),
    }
  };
}