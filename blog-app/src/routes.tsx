/** @jsx createElement */

import { Server } from '@thrain/core/server.ts';
import { Validator } from '@thrain/common/schema.ts';
import { htmlResponse } from '@thrain/common/http-helpers.ts';
import { createElement, renderStaticHTML } from '@thrain/template/index.ts';
import { createBlogPost, deleteBlogPost, editBlogPost, getPostById, getPostBySlug, getPosts } from './db/posts.ts';
import { redirect } from '@thrain/common/utils.ts';
import { BlogPost } from './types.ts';
import { Logger } from '@thrain/middlewares/logger.ts';
import {} from '@thrain/template/jsx-router.tsx'; // here is the stub for JSX.IntrinsicElements

const logger = Logger.instance;

const blogPostValidator = Validator.object({
  title: Validator.string(),
  content: Validator.string(),
});

const blogPostValidatorWithImage = Validator.object({
  title: Validator.string(),
  content: Validator.string(),
  image: Validator.any(),
});

export function createRoutes(server: Server) {
  server.router.get('/', () => redirect('/home'));

  server.router.get('/home', () => {
    return htmlResponse(
      renderStaticHTML(
        <div>
          <h1>Home</h1>

          <p>
            <a href="/blog">Blog</a>
          </p>
        </div>,
      ),
    );
  });

  server.router.get('/blog', async () => {
    const posts = await getPosts();

    return htmlResponse(
      renderStaticHTML(
        <div>
          <h1>Blog Posts</h1>

          <ul>
            {posts.map(({ slug, title }) => (
              <li>
                <a href={`/blog/${slug}`}>{title}</a>
              </li>
            ))}
          </ul>

          <p>
            <a href="/blog/new">New Post</a>
          </p>

          <footer>
            <p>
              <a href="/home">Home</a>
            </p>
          </footer>
        </div>,
      ),
    );
  });

  server.router.get('/blog/new', () => {
    return htmlResponse(
      renderStaticHTML(
        <div style="max-width: 650px; margin: 40px auto; line-height: 1.6;">
          <h1>New Blog Post</h1>
          <form action="/blog" method="POST" style={`display: grid; gap: 1rem; `} encType="multipart/form-data">
            <div style={`display: grid; gap: 0.5rem;`}>
              <label for="title">Title</label>
              <input type="text" name="title" id="title" required="" />
            </div>
            <div style={`display: grid; gap: 0.5rem;`}>
              <label for="content">Content</label>
              <textarea rows="10" name="content" id="content" required="" />
            </div>
            <div style={`display: grid; gap: 0.5rem;`}>
              <label for="image">Cover Image</label>
              <input type="file" name="image" id="image" accept="image/*" />
            </div>
            <div style={`display: flex; `}>
              <button style="max-width: 100px;" type="submit">
                Create
              </button>
            </div>
          </form>

          <footer>
            <p>
              <a href="/blog">Blog</a>
            </p>

            <p>
              <a href="/home">Home</a>
            </p>
          </footer>
        </div>,
      ),
    );
  });

  server.router.post('/blog', async ctx => {
    const formData = await ctx.request.formData();
    const data = Object.fromEntries(formData.entries());
    const values = blogPostValidatorWithImage.safeParse(data);

    if (!values) {
      return new Response('Missing title or content', { status: 400, headers: { 'Content-Type': 'text/html' } });
    }

    const { title, content } = values;
    const slug = title.replaceAll(' ', '-').toLowerCase();

    const file = formData.get('image') as File | null;
    const coverImage = await writeFile(file, slug);

    const post = await createBlogPost({ title, content, slug, coverImage });

    return redirect(`/blog/${post.slug}`, 303);
  });

  server.router.post('/blog/:id/edit', async ctx => {
    const formData = await ctx.request.formData();
    const data = Object.fromEntries(formData.entries());
    const values = blogPostValidator.safeParse(data);

    if (!values) {
      return new Response('Missing title or content', { status: 400, headers: { 'Content-Type': 'text/html' } });
    }

    const post = await editBlogPost(ctx.params.id, values);
    return redirect(`/blog/${post.slug}`, 303);
  });

  server.router.get('/blog/:id/delete', async ctx => {
    await deleteBlogPost(ctx.params.id);
    return redirect(`/blog`, 303);
  });

  server.router.get('/blog/:slug', async ctx => {
    const { slug } = ctx.params;
    const post = await getPostBySlug(slug);
    const imageUrl = await getImageUrl(post);

    if (!post) {
      return htmlResponse('404 Not found');
    }

    return htmlResponse(
      renderStaticHTML(
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p>

          {imageUrl && (
            <p style="width: 100%;">
              <img src={imageUrl ?? ''} alt={post?.title} style="max-width: 100%; border-radius: 8px;" />
            </p>
          )}

          <p>
            <a href={`/blog/${post.id}/edit`}>Edit post</a>
          </p>
          <p>
            <a href={`/blog/${post.id}/delete`}>Delete post</a>
          </p>

          <footer>
            <p>
              <a href="/blog">Blog</a>
            </p>

            <p>
              <a href="/home">Home</a>
            </p>
          </footer>
        </div>,
      ),
    );
  });

  server.router.get('/blog/:id/edit', async ctx => {
    const { id } = ctx.params;
    const post = await getPostById(id);

    if (!post) {
      return htmlResponse('404 Not found');
    }

    return htmlResponse(
      renderStaticHTML(
        <div style="max-width: 650px; margin: 40px auto; line-height: 1.6;">
          <h1>Edit Blog Post</h1>
          <form
            action={`/blog/${post.id}/edit`}
            method="POST"
            style={`display: grid; gap: 1rem; `}
            encType="multipart/form-data"
          >
            <div style={`display: grid; gap: 0.5rem;`}>
              <label for="title">Title</label>
              <input type="text" name="title" id="title" required="" value={post.title} />
            </div>
            <div style={`display: grid; gap: 0.5rem;`}>
              <label for="content">Content</label>
              <textarea rows="10" name="content" id="content" required="">
                {post.content}
              </textarea>
            </div>
            <div style={`display: flex; `}>
              <button style="max-width: 100px;" type="submit">
                Confirm
              </button>
            </div>
          </form>

          <footer>
            <p>
              <a href="/blog">Blog</a>
            </p>

            <p>
              <a href="/home">Home</a>
            </p>
          </footer>
        </div>,
      ),
    );
  });
}

async function writeFile(file: File | null, slug: string) {
  if (file && file.size > 0 && typeof file.name === 'string') {
    await Deno.mkdir('./file-storage', { recursive: true });

    const bytes = new Uint8Array(await file.arrayBuffer());

    const filename = `${slug}-${Date.now()}-${file.name}`;

    await Deno.writeFile(`./file-storage/${filename}`, bytes);
    logger.info(`Saved image to file-storage/${filename}`);

    const coverImage = { slug: filename, type: file.type } satisfies BlogPost['coverImage'];
    return coverImage;
  }

  return null;
}

async function getImageUrl(post: BlogPost | null) {
  if (!post) {
    return null;
  }

  if (post.coverImage) {
    const { slug, type } = post.coverImage;
    const image = await Deno.readFile(`./file-storage/${slug}`);

    const imageUrl = image ? getDataUrl(image, type) : null;
    return imageUrl;
  }

  return null;
}

// dont want to install @types/node and do some other stuff, i think this is fine for now
declare const Buffer: {
  from: (value: ArrayBuffer, encoding?: 'base64') => { toString: (value: 'base64' | 'ascii') => string };
};

function getDataUrl(file: Uint8Array<ArrayBuffer>, type: string) {
  const buffer = Buffer.from(file.buffer);
  return `data:${type};base64,${buffer.toString('base64')}`;
}
