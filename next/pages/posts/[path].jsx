import Page from '../../components/Page';
import CreatedUpdatedText from '../../components/CreatedUpdatedText';
import { posts as factory } from '../../server';

export default function Post(props) {
  const { post: {
    title,
    contents,
    createdAt,
    updatedAt
  }, posts } = props;

  return (
    <Page title={title} posts={posts}>
      <CreatedUpdatedText createdAt={createdAt} updatedAt={updatedAt} />
      <h2>{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: contents }} />
    </Page>
  )
};

export async function getStaticProps(ctx) {
  const { params: { path } } = ctx;
  const posts = await factory();
  return {
    props: {
      posts: posts.metadata(),
      post: posts.indexed().get(path),
    }
  };
}

export async function getStaticPaths() {
  return {
    paths: (await factory()).ids().map(id => ({ params: { path: id } })),
    fallback: false
  };
}