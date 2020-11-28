import { get_post_from_toml } from 'lib/lib';
import fs from 'mz/fs';
import appRootPath from 'app-root-path';

const fetchPosts = async () => {
    const files = await fs.readdir(`${appRootPath}/posts`);
    return Promise
        .all(
            files
            .map(async file => {
                const path = `${appRootPath}/posts/${file}`;
                const stats = await fs.stat(path);
                const text = await fs.readFile(`${appRootPath}/posts/${file}`, 'utf8');
                const post = JSON.parse(get_post_from_toml(text));
                post.createdAt = stats.birthtime.toLocaleDateString();
                post.updatedAt = stats.mtime.toLocaleDateString();
                return Object.freeze(post);
            })
        ).then(posts => posts.filter(post => post.published))
};

export const posts = async () => {
    const posts = await fetchPosts();

    return {
        get: () => posts,
        metadata: () => posts.map(post => ({ id: post.id, title: post.title })),
        indexed: () => {
            const indexed = posts.reduce((agg, post) => {
                agg[post.id] = post;
                return agg;
            }, {});
            return {
                get: (path) => indexed[path],
            };
        },
        ids: () => posts.map(post => post.id)
    }
}
