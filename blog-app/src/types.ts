export type BlogPost = {
  id: string;
  title: string;
  content: string;
  slug: string;
  coverImage: {
    slug: string;
    type: string;
  } | null;
};
