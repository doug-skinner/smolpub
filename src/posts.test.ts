import { describe, expect, test } from "bun:test";
import { getPosts } from "./posts";

describe("getPosts", () => {
  test("should return an array of posts", async () => {
    process.env.POSTS_DIR = "test-content/posts";
    const posts = await getPosts();

    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty("metadata");
    expect(posts[0]).toHaveProperty("content");
  });
});
