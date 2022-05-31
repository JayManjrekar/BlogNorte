import { User } from ".";

export type Post = {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    date_posted: string;
    likes: number;
    tags: Tag[];
};

export type FullPost = Post & {
    author: User;
};

export type ExistingPost = Omit<Post, "likes" | "date_posted">;

export type PostPreview = Omit<Post, "content">;

export type NewPost = Omit<Post, "id" | "slug" | "date_posted" | "likes">;
export type EditPost = Omit<Post, "id" | "slug" | "date_posted" | "likes">;

export type Tag = {
    id: number;
    name: string;
    posts: number;
};