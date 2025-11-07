import { Database } from '@thrain/database/database.ts';
import { Logger } from '@thrain/middlewares/logger.ts';
import { BlogPost } from '../types.ts';

const db = new Database<BlogPost>('./db/posts.json', 'posts');
const logger = Logger.instance;

export async function getPosts() {
  const posts = await db.query({ fields: '*' });

  logger.info('Retrieved data of all posts');
  return posts as BlogPost[];
}

export async function getPostById(id: BlogPost['id']) {
  const [post] = await db.query({
    fields: '*',
    where: {
      field: 'id',
      operator: '=',
      value: decodeURIComponent(id),
    },
  });

  logger.info(`Retrieved data of a post with id ${post.id}`);
  return (post as BlogPost | undefined) ?? null;
}

export async function getPostBySlug(slug: BlogPost['slug']) {
  const [post] = await db.query({
    fields: '*',
    where: {
      field: 'slug',
      operator: '=',
      value: decodeURIComponent(slug),
    },
  });

  logger.info(`Retrieved data of a post with id ${post.id}`);
  return (post as BlogPost | undefined) ?? null;
}

export async function createBlogPost(data: Omit<BlogPost, 'id'>) {
  const post = await db.insert(data);
  logger.info(`Created a new post with id ${post.id} with values ${data}`);
  return post;
}

export async function editBlogPost(id: BlogPost['id'], data: Pick<BlogPost, 'title' | 'content'>) {
  const post = await db.update(id, data);
  logger.info(`Updated a post with id ${post.id} with values ${data}`);
  return post;
}

export async function deleteBlogPost(id: BlogPost['id']) {
  await db.delete(id);
  logger.info(`Deleted post with id ${id}`);
  return true;
}
