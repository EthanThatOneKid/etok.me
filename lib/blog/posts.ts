import type { WalkEntry } from "@std/fs/expand-glob";
import { expandGlob } from "@std/fs/expand-glob";
import { test } from "@std/front-matter";
import { extract } from "@std/front-matter/any";
import { renderHTML } from "./markdown.ts";

export function getPostsByTopicID(posts: Post[], topicID?: string) {
  if (!topicID) {
    return posts;
  }
  return posts.filter((post) =>
    post.attrs.topics.some((t) => toTopicID(t) === topicID)
  );
}

export async function readPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  for await (const file of expandGlob("blog/*.md")) {
    posts.push(readPost(file));
  }
  return posts
    .filter((post) => !post.attrs.draft)
    .toSorted(byDateDescending);
}

export function byPinnedDescending(a: Post, b: Post): number {
  if (a.attrs.pinned && !b.attrs.pinned) return -1;
  if (!a.attrs.pinned && b.attrs.pinned) return 1;
  return byDateDescending(a, b);
}

export function byDateDescending(a: Post, b: Post): number {
  return b.attrs.date.getTime() - a.attrs.date.getTime();
}

export function readPost(entry: WalkEntry): Post {
  const md = Deno.readTextFileSync(entry.path);
  if (!test(md)) {
    throw new Error("invalid front matter in " + entry.path);
  }
  const extracted = extract<PostAttrs>(md);
  if (!isPostAttrs(extracted.attrs)) {
    throw new Error("invalid post attributes in " + entry.path);
  }
  const id = entry.name.replace(/\.md$/, "");
  return {
    id,
    attrs: extracted.attrs,
    html: renderHTML(
      (extracted.attrs.toc ?? true) ? tocPrefix + extracted.body : extracted.body,
    ),
  };
}

const tocPrefix = "<strong>On this page</strong>\n\n[[toc]]\n";

export function countTopics(posts: Post[]): Map<string, number> {
  const topics = new Map<string, number>();
  for (const post of posts) {
    for (const topic of post.attrs.topics) {
      topics.set(topic, (topics.get(topic) ?? 0) + 1);
    }
  }
  return topics;
}

export function getSortedTopics(posts: Post[]): string[] {
  return Array.from(countTopics(posts).entries())
    .toSorted(([aTopic, aCount], [bTopic, bCount]) =>
      aCount > bCount ? -1 : aCount < bCount ? 1 : aTopic.localeCompare(bTopic)
    )
    .map(([topic]) => topic);
}

export interface Post {
  id: string;
  attrs: PostAttrs;
  html: string;
}

export interface PostAttrs {
  pinned?: boolean;
  draft?: boolean;
  title: string;
  description: string;
  authors: PostAuthor[];
  topics: string[];
  date: Date;
  aliases?: string[];
  toc?: boolean;
}

export function isPostAttrs(obj: any): obj is PostAttrs {
  return (
    typeof obj.title === "string" &&
    typeof obj.description === "string" &&
    Array.isArray(obj.authors) &&
    obj.authors.every((author: any) => isPostAuthor(author)) &&
    Array.isArray(obj.topics) &&
    obj.topics.every((topic: any) => typeof topic === "string") &&
    obj.date instanceof Date
  );
}

export interface PostAuthor {
  name: string;
  username: string;
}

export function isPostAuthor(obj: any): obj is PostAuthor {
  return (
    typeof obj.name === "string" &&
    typeof obj.username === "string"
  );
}

export function toTopicID(topic: string) {
  return topic.toLowerCase().replace(/\s+/g, "-");
}

export function getFeaturedPosts(posts: Post[], limit = 3): Post[] {
  return posts.toSorted(byPinnedDescending).slice(0, limit);
}

export function getAliases(posts: Post[]): Map<string, string> {
  const aliases = new Map<string, string>();
  for (const post of posts) {
    if (post.attrs.aliases === undefined) continue;
    for (const alias of post.attrs.aliases) {
      if (aliases.has(alias)) {
        throw new Error("duplicate alias " + alias);
      }
      aliases.set(alias, "/blog/" + post.id);
    }
  }
  return aliases;
}
